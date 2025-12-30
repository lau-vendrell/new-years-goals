interface Props {
  onOpenAbout(): void;
}

export default function Header({ onOpenAbout }: Props) {
  return (
    <header className="appHeader">
      <span>OBJETIVOS 2026</span>
      <button className="link-button" type="button" onClick={onOpenAbout}>
        About
      </button>
    </header>
  );
}
