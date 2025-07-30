export interface DataTableColumn<T, K extends keyof T> {
  key: K
  header: string
  render?: (value: T[K], row: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T, keyof T>[]
  data: T[]
  isLoading: boolean
  emptyMessage?: string
  className?: string
}