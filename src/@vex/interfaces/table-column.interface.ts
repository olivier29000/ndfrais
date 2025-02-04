export interface TableColumn<T> {
  label: string;
  property: string;
  type:
    | 'text'
    | 'image'
    | 'number'
    | 'date'
    | 'dayOfWeekReposList'
    | 'badge'
    | 'progress'
    | 'checkbox'
    | 'button'
    | 'user';
  visible?: boolean;
  cssClasses?: string[];
}
