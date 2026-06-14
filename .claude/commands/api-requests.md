# Skill — API Request Layer with Zod Validation

## Purpose

Standardize the REST API communication layer using Axios + Zod to ensure runtime response validation, automatic typing, and contract safety between frontend and backend.

---

## 1. Axios Instance (`src/api/services/<domain>/api.ts`)

Each service domain has its own Axios instance file. The `baseURL` comes from the centralized `ENV` config object (not from `import.meta.env` directly). Interceptors handle auth headers and error toasts. A mock flag controls whether the domain returns mocked data.

```ts
import axios from "axios";
import { ENV } from "@/config/environmentConfig";
import { getRequestHeaders } from "@/utils/authUtils";
import { toast } from "sonner";

export const USE_<DOMAIN_UPPER>_MOCK = true;

export const api<DomainName> = axios.create({
  baseURL: ENV.baseUrls.<serviceKey>,
});

// Request interceptor — injects auth headers automatically
api<DomainName>.interceptors.request.use((config) => {
  const headers = getRequestHeaders();

  if (config.data instanceof FormData) {
    const { "Content-Type": _contentType, ...headersWithoutContentType } =
      headers;
    Object.assign(config.headers, headersWithoutContentType);
  } else {
    Object.assign(config.headers, headers);
  }

  return config;
});

// Response interceptor — handles 400 errors with toast notifications
api<DomainName>.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 400) {
      const data = error.response.data;
      const message =
        (Array.isArray(data?.erros) &&
          data.erros.length > 0 &&
          data.erros.join(" ")) ||
        data?.message ||
        "Erro na requisição. Por favor tente novamente.";
      toast.error(message);
    }
    return Promise.reject(error);
  },
);
```

**Rules:**

- The `baseURL` must come from `ENV.baseUrls.<serviceKey>` (imported from `@/config/environmentConfig`). Never use `import.meta.env` directly in the api file.
- Auth headers are injected via the **request interceptor** using `getRequestHeaders()` from `@/utils/authUtils` — never set headers manually on each request.
- The request interceptor must strip `Content-Type` when sending `FormData` so the browser sets the correct multipart boundary.
- The **response interceptor** handles HTTP 400 errors by showing a `toast.error()` with the API error message.
- Never import `axios` directly in request files — always use the domain-specific instance.
- The **mock flag** (`USE_<DOMAIN_UPPER>_MOCK`) is exported from this file and controls all endpoints in the domain. Set to `true` during development when the backend is not ready; set to `false` to use real API calls.
- Available `ENV.baseUrls` keys: `auth`, `monthlyParking`, `monthlyDiscount`, `garageCorporate`, `prestacaoContas`, `gestaoContrate`, `orquestrador`.

---

## 1.1. Versioned API Folders (v1/v2)

When an API domain exposes multiple versions of the same endpoints, organize them into version subfolders:

```
src/api/services/<domain>/<service>/
├── v1/
│   ├── list-credentials.ts
│   ├── add-child-credential.ts
│   └── update-physical-access-card.ts
├── v2/
│   ├── list-credentials-paginated.ts
│   ├── add-child-credential.ts
│   └── disable-access-card.ts
└── api-doc-v1.json          # OpenAPI docs stay at root level
```

**Rules:**

- Each version folder contains only `.ts` endpoint files — no `api.ts` instance (the shared Axios instance stays at the domain level, e.g., `src/api/services/<domain>/api.ts`).
- Import the api instance with a relative path: `import { api<DomainName> } from "../../api"`.
- When both v1 and v2 expose the same action, suffix the v1 types/functions with `V1` to avoid naming collisions (e.g., `AddChildCredentialV1Body`, `addChildCredentialV1`). The v2 version keeps the base name.
- API documentation files (`.json`) stay at the `<service>/` root level, named `api-doc-v1.json`, `api-doc-v2.json`, etc.
- Mocks mirror the services structure but do **not** need version subfolders unless both versions have mocks — just add `/v2/` to the import path.

---

## 2. Request File Pattern

Every file in `src/api/services/<domain>/<action>.ts` follows **exactly** this structure:

```ts
import { z } from "zod";
import { api<DomainName>, USE_<DOMAIN_UPPER>_MOCK } from "./api";
import { <action>SuccessMock } from "@/api/mocks/<domain>/<action>.mock";

// 1. (Optional) Input/body validation schema
export const exampleInputSchema = z.object({
  field1: z.string().min(2, { message: "Field is required." }),
  field2: z.number(),
});

export type ExampleInput = z.infer<typeof exampleInputSchema>;

// 2. Response validation schema
const exampleResponseSchema = z.object({
  data: z
    .object({
      // fields returned by the API — adapt per endpoint
    })
    .nullable(),
  message: z.string().nullable(),
});

export type ExampleResponse = z.infer<typeof exampleResponseSchema>;

// 3. Async function that performs the call and validates the response
export async function example(data: ExampleInput) {
  if (USE_<DOMAIN_UPPER>_MOCK) return exampleSuccessMock;
  const response = await api<DomainName>.post("/route", data);
  return exampleResponseSchema.parse(response.data);
}
```

### Example: GET without body

```ts
import { z } from "zod";
import { api<DomainName>, USE_<DOMAIN_UPPER>_MOCK } from "./api";
import { listItemsSuccessMock } from "@/api/mocks/<domain>/list-items.mock";

const listItemsResponseSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
      }),
    )
    .nullable(),
  message: z.string().nullable(),
});

export type ListItemsResponse = z.infer<typeof listItemsResponseSchema>;

export async function listItems() {
  if (USE_<DOMAIN_UPPER>_MOCK) return listItemsSuccessMock;
  const response = await api<DomainName>.get("/items");
  return listItemsResponseSchema.parse(response.data);
}
```

---

## 3. Mandatory Rules

1. **Always define a Zod schema for the response.** Runtime validation ensures the API is returning the expected format. Use `schema.parse(response.data)` — never return `response.data` directly.

2. **The standard response envelope is:** `{ data: T | null, message: string | null }`. Adapt `T` per endpoint. Some APIs may not use the envelope — adapt the schema to match the actual response format.

3. **Derive TypeScript types from schemas** using `z.infer<typeof schema>` — never manually define types that duplicate the schema.

4. **Input schemas** (request body) are optional but recommended when the same schema will be used for form validation (e.g., react-hook-form + zodResolver).

5. **Reuse schemas** across files when endpoints share the same response format:

```ts
import { getUserResponseSchema } from "./get-user";
import { api<DomainName>, USE_<DOMAIN_UPPER>_MOCK } from "./api";
import { getMeSuccessMock } from "@/api/mocks/<domain>/get-me.mock";

export async function getMe() {
  if (USE_<DOMAIN_UPPER>_MOCK) return getMeSuccessMock;
  const response = await api<DomainName>.get("/user/me");
  return getUserResponseSchema.parse(response.data);
}
```

**Shared types/schemas live in `type.ts`.** When a schema or type is shared by **more
than one endpoint of the same domain** (e.g. a sub-entity reused across responses, a
generic paging wrapper, an enum), put it in `src/api/services/<domain>/type.ts` — not in
an endpoint file. Endpoint files import from `./type`; never import a shared schema from
another endpoint file (e.g. `./get-user`), since that couples unrelated endpoints and
creates accidental import chains. Keep endpoint-specific schemas in their own service file.

```ts
// src/api/services/<domain>/type.ts
import { z } from "zod";

export const itemSchema = z.object({ id: z.string(), name: z.string() });
export type Item = z.infer<typeof itemSchema>;

export interface Paging<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
```

```ts
// src/api/services/<domain>/list-items.ts
import { z } from "zod";
import { api<DomainName>, USE_<DOMAIN_UPPER>_MOCK } from "./api";
import { itemSchema } from "./type";
import type { Item, Paging } from "./type";
import { listItemsSuccessMock } from "@/api/mocks/<domain>/list-items.mock";

const listItemsResponseSchema = z.object({ items: z.array(itemSchema), total: z.number() });

export async function listItems(): Promise<Paging<Item>> {
  if (USE_<DOMAIN_UPPER>_MOCK) return listItemsSuccessMock;
  const response = await api<DomainName>.get("/items");
  return listItemsResponseSchema.parse(response.data) as Paging<Item>;
}
```

> Scope: `type.ts` is for types shared **within one API domain**. Types shared across
> unrelated modules still belong in the global `src/types/`.

6. **Mock guard is always the first line of the function body.** The `if (USE_<DOMAIN_UPPER>_MOCK) return <action>SuccessMock;` check must appear before any API call. This ensures no network requests are made when mocks are active.

7. **Naming conventions:**

| Element         | Pattern                                   | Example                      |
| --------------- | ----------------------------------------- | ---------------------------- |
| Response schema | `<action>ResponseSchema`                  | `authenticateResponseSchema` |
| Input schema    | `<action>Schema` or `<action>InputSchema` | `authenticateSchema`         |
| Response type   | `<Action>Response`                        | `AuthenticateResponse`       |
| Input type      | `<Action>Variables` or `<Action>Body`     | `AuthenticateVariables`      |
| Function        | descriptive verb                          | `authenticate`, `getUser`    |
| Mock flag       | `USE_<DOMAIN_UPPER>_MOCK`                 | `USE_ORQUESTRADOR_MOCK`      |

---

## 4. Mocks

Organize mocks at `src/api/mocks/<domain>/<action>.mock.ts`, mirroring the `services/` structure.

```ts
import type { ExampleResponse } from "@/api/services/<domain>/<action>";

// Success variant
export const exampleSuccessMock: ExampleResponse = {
  data: {
    /* valid data */
  },
  message: null,
};

// Empty variant
export const exampleEmptyMock: ExampleResponse = {
  data: null,
  message: null,
};

// Error variant
export const exampleErrorMock = {
  title: "Erro ao processar requisição",
  status: 500,
  detail: "Erro interno do servidor",
};
```

**Rules:**

- Always use the Zod-inferred type (`import type`) to type the success and empty mock variants.
- The error mock does not need to match the response type — it represents a server error payload.
- Create at least 3 variants: **success**, **empty**, and **error**.
- File naming: `<action>.mock.ts`.
- The **success mock** is what gets returned when the mock flag is active.

---

## 5. Checklist for New Endpoints

- [ ] Create or reuse the Axios instance at `src/api/services/<domain>/api.ts` with `ENV.baseUrls.<key>`, request interceptor (auth headers), response interceptor (400 toast), and `USE_<DOMAIN_UPPER>_MOCK` flag
- [ ] Create file at `src/api/services/<domain>/<action>.ts`
- [ ] Import the domain-specific api instance and mock flag from `./api`
- [ ] Import the success mock from `@/api/mocks/<domain>/<action>.mock`
- [ ] Define Zod response schema (adapt to actual API response format)
- [ ] Move any schema/type shared by 2+ endpoints into `src/api/services/<domain>/type.ts` and import it from `./type` (never from a sibling endpoint file)
- [ ] Export the inferred type via `z.infer`
- [ ] Create async function with mock guard as the first line, then API call with `schema.parse(response.data)`
- [ ] (Optional) Define input schema for form validation
- [ ] Create mocks at `src/api/mocks/<domain>/<action>.mock.ts` with success, empty, and error variants
