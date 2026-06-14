# Skill — Tab Pattern with Filters, InfiniteTable & Columns

## Purpose

Standardize the creation of tabbed views that combine filters, infinite-scroll tables with tooltip-enabled columns, and detail sheets. Every new tab in the application must follow this structure.

---

## 1. File Structure

Each tab requires these files, co-located inside the feature folder:

```
components/[feature]/
├── [Entity]Tab.tsx                        # Tab component (orchestration)
├── [Entity]DetailsSheet.tsx               # Detail sheet/modal
├── [Entity]Card.tsx                       # Mobile card renderer
├── columns/
│   └── [entity]Columns.tsx                # Column definitions factory
├── filters/
│   └── [Entity]Filters.tsx                # Desktop filter bar
└── hooks/
    └── use[Entity]InfiniteTable.ts        # Hook with filters, query, modal state
```

**Naming rules:**

| File                  | Convention                          | Example                              |
|-----------------------|-------------------------------------|--------------------------------------|
| Tab component         | PascalCase + `Tab`                  | `CredentialsTab.tsx`                 |
| Columns factory       | camelCase + `Columns`               | `credentialColumns.tsx`              |
| Filters component     | PascalCase + `Filters`              | `CredentialsFilters.tsx`             |
| Hook                  | `use` + PascalCase + `InfiniteTable`| `useCredentialsInfiniteTable.ts`     |
| Details sheet         | PascalCase + `DetailsSheet`         | `CredentialDetailsSheet.tsx`         |
| Mobile card           | PascalCase + `Card`                 | `CredentialCard.tsx`                 |

---

## 2. Columns Factory — `columns/[entity]Columns.tsx`

A **function** (not arrow) that receives dependencies and returns `ColumnDef<T>[]`.

### Mandatory rules

- Use `function` declaration (never arrow export)
- All text cells use `text-sm text-gray-900` — no `font-medium`, `font-mono`, or `text-gray-600` variations
- Truncatable columns must wrap content with `Tooltip`
- `Badge` for status/tags, `Button` with `Eye` icon for actions

### Template

```tsx
import { ColumnDef } from "@/components/ui/infinite-table/types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function create<Entity>Columns(
  getGarageName: (garageId: number) => string,
  onViewDetails: (item: EntityType) => void,
): ColumnDef<EntityType>[] {
  return [
    // --- Text column (truncatable → with Tooltip) ---
    {
      accessorKey: "name",
      header: "Nome",
      className: "w-[20%] py-2 text-sm",
      cell: (item) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm text-gray-900 truncate">
                {item.name ?? "-"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.name ?? "-"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },

    // --- Text column (non-truncatable → no Tooltip) ---
    {
      accessorKey: "document",
      header: "Documento",
      className: "w-[15%] text-sm",
      cell: (item) => (
        <div className="text-sm text-gray-900">
          {item.document ?? "-"}
        </div>
      ),
    },

    // --- Garage column (always truncatable) ---
    {
      header: "Garagem",
      className: "w-[21%] text-sm truncate",
      cell: (item) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm text-gray-900 truncate">
                {getGarageName(item.idGarage)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getGarageName(item.idGarage)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },

    // --- Status column (Badge) ---
    {
      header: "Status",
      className: "w-[10%] text-center",
      cell: (item) => (
        <Badge
          variant={item.active ? "default" : "migration"}
          className="text-xs"
        >
          {item.active ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },

    // --- Actions column ---
    {
      header: "Ações",
      className: "w-[10%] content-center",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(item)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Eye className="h-5 w-5 text-estapar-green" />
          </Button>
        </div>
      ),
    },
  ];
}
```

### Column styling reference

| Element         | Classes                                        |
|-----------------|------------------------------------------------|
| Text cell       | `text-sm text-gray-900`                        |
| Truncatable     | add `truncate` + wrap with `Tooltip`           |
| Badge           | `text-xs` on Badge                             |
| Action button   | `h-8 w-8 p-0 hover:bg-gray-100` ghost button  |
| Action icon     | `h-5 w-5 text-estapar-green`                  |
| Header className| `w-[N%] py-2 text-sm` (use `truncate` if needed)|

---

## 3. Tab Component — `[Entity]Tab.tsx`

Orchestrates Filters, InfiniteTable, and DetailsSheet. Uses `function` declaration.

### Template

```tsx
import InfiniteTable from "@/components/ui/infinite-table/InfiniteTable";
import <Entity>Filters from "./filters/<Entity>Filters";
import <Entity>DetailsSheet from "./<Entity>DetailsSheet";
import <Entity>Card from "./<Entity>Card";
import { use<Entity>InfiniteTable } from "./hooks/use<Entity>InfiniteTable";
import { useGarageNames } from "./hooks/useGarageNames";
import { useSidebar } from "@/contexts/SidebarContext";
import { create<Entity>Columns } from "./columns/<entity>Columns";

function <Entity>Tab() {
  const { isMobile } = useSidebar();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    loadMoreRef,
    totalRecords,
    // modal state
    selectedId,
    selectedData,
    isDetailModalOpen,
    // filter values + setters
    ativoFilter,
    setAtivoFilter,
    // ... other filters
    handleViewDetails,
    handleCloseDetailModal,
  } = use<Entity>InfiniteTable();

  const { getGarageName } = useGarageNames();

  const mobileCardRenderer = (item: EntityType, _index: number) => (
    <EntityCard
      key={item.id}
      item={item}
      garageName={getGarageName(item.idGarage)}
      onViewDetails={handleViewDetails}
    />
  );

  const columns = create<Entity>Columns(getGarageName, handleViewDetails);

  return (
    <div className="space-y-4">
      {!isMobile && (
        <<Entity>Filters
          ativoFilter={ativoFilter}
          setAtivoFilter={setAtivoFilter}
          {/* ...other filter props */}
          totalRecords={totalRecords}
        />
      )}

      <InfiniteTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        loadMoreRef={loadMoreRef}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        mobileCardRenderer={mobileCardRenderer}
        enableCSVExport={true}
        emptyMessage="Nenhum(a) <entity> encontrado(a)."
      />

      <<Entity>DetailsSheet
        id={selectedId}
        data={selectedData}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
}

export default <Entity>Tab;
```

### Rules

- Filters are **hidden on mobile** (`!isMobile` guard) — mobile uses `useFilterManager` from the hook
- Column factory is called in the component body (not inside useMemo — the hook handles memoization)
- `mobileCardRenderer` renders a dedicated `Card` component for mobile

---

## 4. Filters Component — `filters/[Entity]Filters.tsx`

Controlled component — receives all filter values and setters as props.

### Template

```tsx
import AtivoSelect, { type AtivoFilterValue } from "./AtivoToggle";
import TotalRecords from "./TotalRecords";
import {
  ClearableDocumentInput,
  ClearableGarageSelector,
} from "@/components/shared/filters";

interface <Entity>FiltersProps {
  ativoFilter: AtivoFilterValue;
  setAtivoFilter: (value: AtivoFilterValue) => void;
  documentFilter: string;
  onDocumentChange: (value: string) => void;
  documentIsComplete: boolean;
  documentIsValid: boolean;
  totalRecords: number;
  garageName: string;
  onGarageNameChange: (value: string) => void;
  onGarageSelect: (garageId: number | null) => void;
}

function <Entity>Filters({ ...props }: <Entity>FiltersProps) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-md border relative">
        <div className="flex items-center space-x-4 w-full">
          <AtivoSelect
            value={props.ativoFilter}
            onValueChange={props.setAtivoFilter}
          />
          <div className="flex-1 max-w-[320px]">
            <ClearableGarageSelector ... />
          </div>
          <div className="flex-1 max-w-[320px]">
            <ClearableDocumentInput ... />
          </div>
          {/* additional filters as needed */}
        </div>
      </div>

      <div className="col-12 pt-3 pb-1 text-center">
        <TotalRecords total={props.totalRecords} />
      </div>
    </div>
  );
}

export default <Entity>Filters;
```

### Layout rules

- Outer container: `bg-white p-4 rounded-md border`
- Filter inputs in a horizontal flex row: `flex items-center space-x-4 w-full`
- Each input wrapper: `flex-1 max-w-[320px]`
- `TotalRecords` below the filter bar, centered

### Available shared filter components

| Component                     | Location                                |
|-------------------------------|-----------------------------------------|
| `AtivoSelect`                 | `./AtivoToggle`                         |
| `TotalRecords`                | `./TotalRecords`                        |
| `ClearableDocumentInput`      | `@/components/shared/filters`           |
| `ClearableGarageSelector`     | `@/components/shared/filters`           |
| `ClearableContractNumberInput`| `@/components/shared/filters`           |
| `ClearablePlateInput`         | `@/components/shared/filters`           |
| `MigradoToggle`               | `./MigradoToggle`                       |

---

## 5. Infinite Table Hook — `hooks/use[Entity]InfiniteTable.ts`

Manages ALL state: filters, validation, debouncing, detail modal, and the infinite query.

### Responsibilities

1. **Filter state** — individual `useState` per filter (ativoFilter, documentFilter, garageName, etc.)
2. **Document validation** — `isValidDocument`, `isDocumentComplete` from `@/utils/documentUtils`
3. **Debouncing** — `setTimeout` for validated document/plate before updating query key
4. **Infinite query** — `useInfiniteQuery` (TanStack) or `useInfiniteTable` (custom abstraction)
5. **IntersectionObserver** — `loadMoreRef` with `useRef` + `useEffect` to trigger `fetchNextPage`
6. **Detail modal** — `selectedId`, `selectedData`, `isDetailModalOpen` + open/close handlers
7. **Mobile filter support** — optional `useFilterManager` integration for mobile filter drawer

### Template (simplified)

```ts
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { AtivoFilterValue } from "../filters/AtivoToggle";

export function use<Entity>InfiniteTable() {
  // Modal state
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<EntityType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filters
  const [ativoFilter, setAtivoFilter] = useState<AtivoFilterValue>("all");
  const [documentFilter, setDocumentFilter] = useState("");
  const [garageName, setGarageName] = useState("");
  const [selectedGarageId, setSelectedGarageId] = useState<number | undefined>(undefined);

  // Document validation
  const documentIsValid = documentFilter ? isValidDocument(documentFilter) : true;
  const documentIsComplete = documentFilter.length >= 11;

  // Infinite query
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["<entity>", ativoFilter, documentFilter, selectedGarageId],
      queryFn: async ({ pageParam = 1 }) => {
        const params = { pageNumber: pageParam, pageSize: 20 };
        // apply filters to params...
        return fetchEntityPaginated(params);
      },
      getNextPageParam: (lastPage) => {
        const paginated = lastPage.data;
        if (!paginated) return undefined;
        return paginated.hasNextPage ? paginated.currentPage + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const allItems = data?.pages?.flatMap((page) => page.data?.data ?? []) || [];
  const totalRecords = data?.pages?.[0]?.data?.totalRecords || 0;

  // IntersectionObserver for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || !hasNextPage || isFetchingNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.5 },
    );

    observer.observe(currentRef);
    return () => {
      observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Modal handlers
  function handleViewDetails(item: EntityType) {
    setSelectedId(item.id);
    setSelectedData(item);
    setIsDetailModalOpen(true);
  }

  function handleCloseDetailModal() {
    setIsDetailModalOpen(false);
    setSelectedId(null);
    setSelectedData(null);
  }

  return {
    data: allItems,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    loadMoreRef,
    totalRecords,
    selectedId,
    selectedData,
    isDetailModalOpen,
    // filter values + setters...
    ativoFilter,
    setAtivoFilter,
    documentFilter,
    setDocumentFilter,
    documentIsValid,
    documentIsComplete,
    garageName,
    setGarageName,
    selectedGarageId,
    setSelectedGarageId,
    handleViewDetails,
    handleCloseDetailModal,
  };
}
```

---

## 6. InfiniteTable Component Reference

The shared `InfiniteTable` component from `@/components/ui/infinite-table/InfiniteTable` accepts:

| Prop                  | Type                                      | Required |
|-----------------------|-------------------------------------------|----------|
| `columns`             | `ColumnDef<T>[]`                          | Yes      |
| `data`                | `T[]`                                     | Yes      |
| `isLoading`           | `boolean`                                 | Yes      |
| `isError`             | `boolean`                                 | Yes      |
| `error`               | `Error \| null`                           | No       |
| `loadMoreRef`         | `React.RefObject<HTMLDivElement>`         | Yes      |
| `hasNextPage`         | `boolean`                                 | No       |
| `isFetchingNextPage`  | `boolean`                                 | No       |
| `mobileCardRenderer`  | `(item: T, index: number) => ReactNode`   | No       |
| `enableCSVExport`     | `boolean`                                 | No       |
| `csvExportOptions`    | `{ filename, exportFunction }`            | No       |
| `emptyMessage`        | `string`                                  | No       |

---

## 7. Checklist for New Tabs

- [ ] Create the column factory in `columns/<entity>Columns.tsx` using `function` declaration
- [ ] Use `text-sm text-gray-900` for all text cells
- [ ] Add `Tooltip` wrapper on all truncatable columns
- [ ] Use `Badge` for status columns, `Eye` button for actions
- [ ] Create `filters/<Entity>Filters.tsx` as a controlled component with `AtivoSelect` + `TotalRecords`
- [ ] Create `hooks/use<Entity>InfiniteTable.ts` with filter state, validation, infinite query, and modal state
- [ ] Create `<Entity>Tab.tsx` composing Filters + InfiniteTable + DetailsSheet
- [ ] Create `<Entity>Card.tsx` for mobile card rendering
- [ ] Create `<Entity>DetailsSheet.tsx` for the detail view
- [ ] Desktop filters hidden on mobile (`!isMobile` guard)
- [ ] Set `emptyMessage` in Portuguese on `InfiniteTable`
