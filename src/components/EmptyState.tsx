interface Props {
  icon: string;
  text: string;
  action?: { label: string; href: string };
}

export function EmptyState({ icon, text, action }: Props) {
  return (
    <div class="empty-state">
      <div class="empty-state-icon">{icon}</div>
      <p class="empty-state-text">{text}</p>
      {action && (
        <a href={action.href} class="btn btn-primary">
          {action.label}
        </a>
      )}
    </div>
  );
}
