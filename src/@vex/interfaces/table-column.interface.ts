export interface TableColumn<T> {
  label: string;
  property: string;
  type:
    | 'text'
    | 'image'
    | 'badge'
    | 'progress'
    | 'checkbox'
    | 'button'
    | 'user';
  visible?: boolean;
  cssClasses?: string[];
}
