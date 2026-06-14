# Skill — Component Patterns for React SPA

## Purpose

Define mandatory patterns for React components, ensuring clear separation of concerns, predictable state management, and maintainable code across the project.

---

## Syntax Rules

### Function declarations for components and hooks

Always use `function` declarations. Never use arrow functions to define components or hooks.

```tsx
// GOOD
function BookingDocumentCard({ data, onSave }: BookingDocumentCardProps) {
  return <div>...</div>
}

// GOOD
function useBookingDocument(bookingId: number) {
  // ...
}

// BAD — arrow function for component
const BookingDocumentCard = ({ data }: Props) => { ... }

// BAD — React.FC
const BookingDocumentCard: React.FC<Props> = ({ data }) => { ... }
```

### Arrow functions only for inline callbacks and anonymous functions

```tsx
// GOOD — function for named handlers
function handleClick() { ... }
function handleSubmit(values: FormValues) { ... }

// GOOD — arrow only for inline/anonymous
onClick={() => setOpen(true)}
array.map((item) => item.id)

// BAD — arrow for component definition
const MyComponent = () => { ... }

// BAD — arrow for hook definition
const useMyHook = () => { ... }

// BAD — arrow for named handler
const handleClick = () => { ... }
```

### Direct imports from React — never use `React.` prefix

```tsx
// GOOD
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

useEffect(() => { ... }, [])
const value = useMemo(() => compute(), [dep])

// BAD
React.useEffect(() => { ... }, [])
React.useMemo(() => compute(), [dep])
```

---

## Component Categories

Every component in the project falls into one of these categories:

| Category            | Location                                  | Responsibility                              |
|---------------------|-------------------------------------------|---------------------------------------------|
| **UI Primitive**    | `components/ui/`                          | Visual building blocks, no business logic   |
| **Layout**          | `components/layout/`                      | Page structure (Navbar, Sidebar, etc.)       |
| **Feature**         | `components/[feature]/`                   | Domain-specific UI + UI state only          |
| **Page**            | `pages/[page-name]/`                      | Data fetching, orchestration, routing       |

---

## 1. UI Primitives — Compound Components

UI primitives in `components/ui/` use the **compound component pattern** provided by shadcn/ui (Radix UI). These are the ONLY components that should use compound patterns.

```tsx
// Correct — using shadcn compound components as consumers
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### When to create NEW compound components

Only when ALL of these are true:
- It is a **generic UI component** (not tied to a domain/feature)
- It has **multiple related parts** that share implicit state
- **Consumers need flexibility** in how they compose the parts
- It will live in `components/ui/`

Examples where compound IS appropriate:
- Custom `DataTable` with `DataTable.Header`, `DataTable.Body`, `DataTable.Pagination`
- Custom `Wizard` with `Wizard.Step`, `Wizard.Navigation`
- Custom `Stepper` with `Stepper.Item`, `Stepper.Separator`

Examples where compound is NOT appropriate:
- `BookingDocumentCard` — feature component, not a reusable primitive
- `DocumentEditDialog` — domain-specific form dialog
- Any component under `components/[feature]/`

---

## 2. Feature-Based Architecture

Components and hooks are **co-located with the feature they belong to**. Only truly global/reusable items live in the root `components/` or `hooks/` folders.

### Feature component structure

```
components/[feature]/
├── MyComponent.tsx                # Main component
├── MySubComponent.tsx             # Sub-component used only by MyComponent
├── AnotherComponent.tsx           # Another component in this feature
├── components/                    # Components local to this feature
│   ├── InvoiceFrame.tsx
│   └── DocumentActions.tsx
└── hooks/                         # Hooks local to this feature
    ├── useMyComponent.ts
    └── useDocumentActions.ts
```

### Page structure (feature-based)

```
pages/[page-name]/
├── PageName.tsx                   # Main page component
├── components/                    # Components exclusive to this page
│   ├── PageHeader.tsx
│   └── PageFilters.tsx
└── hooks/                         # Hooks exclusive to this page
    └── usePageData.ts
```

### What goes in global folders

| Global folder      | Only if...                                                   |
|---------------------|--------------------------------------------------------------|
| `components/ui/`   | It is a UI primitive (Button, Input, Card, etc.)             |
| `components/layout/`| It is a structural layout component (Navbar, Sidebar, etc.) |
| `hooks/`           | The hook is used by **3+ features** across the project       |
| `utils/`           | The function has **no React dependency** and is generic      |

**Rule**: if a component or hook is used by only 1 or 2 features, it stays co-located with the feature. Move to global only when reuse is proven (3+ consumers).

---

## 3. Feature Components — Props + UI State Only

Feature components handle **rendering and UI state** (isOpen, isCollapsed, isHovered). They do NOT:
- Call API functions directly
- Use `useMutation` or `useQuery`
- Contain async logic (try/catch around API calls)

### Mandatory structure

```tsx
// components/[feature]/MyComponent.tsx

import { useState } from 'react'

interface MyComponentProps {
  data: SomeType
  onSave: (values: SaveInput) => void
  onDelete: (id: number) => void
  isLoading?: boolean
}

function MyComponent({ data, onSave, onDelete, isLoading }: MyComponentProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (/* JSX */)
}

export default MyComponent
```

### When a feature component needs complex logic

Extract a **custom hook** in a co-located `hooks/` folder inside the feature. The hook handles mutations, async operations, and derived state.

```
components/financial-statements/contracts/
├── BookingDocumentCard.tsx           # UI + UI state only
├── DocumentEditDialog.tsx            # UI + react-hook-form
├── components/
│   └── InvoiceFrame.tsx              # Local sub-component
└── hooks/
    ├── useBookingDocument.ts         # upload, delete, download mutations
    └── useDocumentEditForm.ts        # form logic + save mutation
```

---

## 4. Custom Hooks — All Business Logic Lives Here

### When a hook is mandatory

A feature component MUST have a co-located hook when any of these are true:
- It has **async logic** (API calls, file uploads)
- It has **more than 3 state variables**
- It contains **mutations** (create, update, delete)

### Hook structure

```tsx
// components/[feature]/hooks/useBookingDocument.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadDocument, deleteDocument } from '@/api/services/gestao-contrate/document'
import { toast } from 'sonner'

function useBookingDocument(bookingId: number, garageId: string) {
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-documents', bookingId] })
      toast.success('Documento enviado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao enviar documento')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-documents', bookingId] })
      toast.success('Documento excluído com sucesso')
    },
  })

  return {
    upload: uploadMutation.mutate,
    remove: deleteMutation.mutate,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

export default useBookingDocument
```

### Where mutations live

Mutations live in the **hook of the component that triggers the action**, NOT in the page. The page only handles queries (`useQuery`) and passes data down.

```
Page (useQuery) → passes data as props
  └── Feature Component (uses its own co-located hook with useMutation)
```

Exception: when a mutation result needs to affect multiple sibling components, lift it to the nearest common parent.

---

## 5. Forms — react-hook-form + Zod (Mandatory)

Any form with **more than 2 fields** MUST use react-hook-form with Zod validation.

### Form component pattern

```tsx
// components/[feature]/DocumentEditDialog.tsx

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const documentEditSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  supplierName: z.string(),
  invoiceNumber: z.string(),
  costCenter: z.string().optional(),
  invoiceAmount: z.number(),
  allocationAmount: z.number(),
})

type DocumentEditValues = z.infer<typeof documentEditSchema>

interface DocumentEditDialogProps {
  document: DocumentFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (values: DocumentEditValues) => void
}

function DocumentEditDialog({ document, open, onOpenChange, onSave }: DocumentEditDialogProps) {
  const form = useForm<DocumentEditValues>({
    resolver: zodResolver(documentEditSchema),
    defaultValues: { description: '', supplierName: '', invoiceNumber: '' },
  })

  // Reset form when document changes
  useEffect(() => {
    if (document) {
      form.reset({
        description: document.description || '',
        supplierName: document.supplierName || '',
        // ...
      })
    }
  }, [document, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSave)}>
          {/* form fields */}
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentEditDialog
```

### Rules

- **Never** use multiple `useState` for form fields
- Define the Zod schema in the same file as the form component (unless shared)
- Use `form.reset()` to sync external data — never `useEffect` setting individual states
- The form component receives an `onSave` callback — it does NOT make API calls directly

---

## 6. Dialogs and Modals — Controlled by Parent

### Pattern

The parent controls `open` state. The dialog receives **one data object** (not fragmented props).

```tsx
// Parent
const [fileToEdit, setFileToEdit] = useState<DocumentFile | null>(null)

<DocumentEditDialog
  document={fileToEdit}
  open={!!fileToEdit}
  onOpenChange={(open) => !open && setFileToEdit(null)}
  onSave={handleSave}
/>
```

### Rules

- Dialog receives at most **1 data prop + open + onOpenChange + callbacks**
- Never pass 5+ separate data props to a dialog — pass the object
- Dialog manages its own internal form state via react-hook-form
- Dialog content unmounts when closed (Radix default) — no performance concern

### Anti-pattern

```tsx
// BAD — fragmented props
<DocumentEditDialog
  documento={fileToEdit}
  invoiceNumber={editContext.invoiceNumber}
  supplierName={editContext.supplierName}
  documentTypeId={editContext.documentTypeId}
  invoiceTotalAmount={editContext.invoiceTotalAmount}
  allocatedAmount={editContext.allocatedAmount}
/>
```

```tsx
// GOOD — single data object
<DocumentEditDialog
  document={fileToEdit}
  open={!!fileToEdit}
  onOpenChange={...}
  onSave={handleSave}
/>
```

If the API response doesn't have the shape the dialog needs, map it at the point of selection, not through multiple props.

---

## 7. Sub-Components in the Same File

Allowed when:
- The sub-component is **small** (under ~50 lines of JSX)
- It is used **only** by the parent component in that file
- The total file stays **under ~200 lines**

When the file grows beyond 200 lines because of sub-components, extract them to `components/` inside the feature folder.

```tsx
// OK — small sub-component in same file
function InvoiceFrame({ invoice, onEdit }: InvoiceFrameProps) {
  return <div>...</div>
}

function BookingDocumentCard({ data }: BookingDocumentCardProps) {
  return (
    <Card>
      <InvoiceFrame invoice={data.invoice} onEdit={handleEdit} />
    </Card>
  )
}
```

When extracted:

```
components/[feature]/
├── BookingDocumentCard.tsx
└── components/
    └── InvoiceFrame.tsx            # Extracted local sub-component
```

---

## 8. File Size Limits

| Type              | Max lines | Action when exceeded                          |
|-------------------|-----------|-----------------------------------------------|
| Component (.tsx)  | ~200      | Extract sub-components or hooks               |
| Hook (.ts)        | ~150      | Split into focused hooks                      |
| API service (.ts) | No limit  | Naturally short by convention                 |

These are guidelines, not hard rules — but exceeding them should trigger a review.

---

## 9. Pages — Orchestration Layer

Pages fetch data and compose feature components. They are the **only place** where `useQuery` is called for page-level data.

```tsx
// pages/booking-detail/BookingDetail.tsx

import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBooking } from '@/api/services/gestao-contrate/booking'

function BookingDetail() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(Number(id)),
  })

  if (isLoading) return <Skeleton />

  return (
    <div>
      <BookingDetailView booking={data} />
      <BookingDocumentCard
        documents={data.documents}
        bookingId={Number(id)}
      />
    </div>
  )
}

export default BookingDetail
```

---

## Quick Decision Guide

| Question                                                | Answer                                                    |
|---------------------------------------------------------|-----------------------------------------------------------|
| Component has async logic or API calls?                 | Extract to a co-located hook with `useMutation`           |
| Component has 3+ state variables?                       | Extract to a co-located hook                              |
| Component is a form with 2+ fields?                     | Use react-hook-form + Zod                                 |
| Need a compound component?                              | Only if it's a reusable UI primitive in `components/ui/`  |
| Dialog needs data from parent?                          | Pass 1 data object, not multiple fragmented props         |
| Sub-component growing the file past 200 lines?          | Extract to `components/` inside the feature folder        |
| Where does `useQuery` go?                               | In the page/tab component                                 |
| Where does `useMutation` go?                            | In the co-located hook of the component that triggers it  |
| Component file over 200 lines?                          | Split: extract hooks, sub-components, or both             |
| Is the hook/component used by 3+ features?              | Move to global `hooks/` or `components/`                  |
| Is it used by only 1-2 features?                        | Keep co-located with the feature                          |

---

## Summary of Patterns

```
Syntax              → function declarations (components, hooks, handlers), direct React imports, arrow only for inline/anonymous callbacks
UI Primitives       → Compound components (shadcn/Radix) in components/ui/
Feature Components  → function + props + UI state only, no API calls
Custom Hooks        → Co-located in feature's hooks/, all mutations and async logic
Forms               → react-hook-form + Zod, always
Dialogs             → Parent controls open, dialog gets 1 data object
Pages               → useQuery + composition, no direct UI logic
Co-location         → Components and hooks live with their feature, global only when 3+ consumers
```
