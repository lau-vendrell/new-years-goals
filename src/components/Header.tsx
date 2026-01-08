interface Props {
  onOpenAbout(): void;
}

export default function Header({ onOpenAbout }: Props) {
  return (
    <header className="topHeader">
      <div className="topHeaderInner layoutGrid">
        <div className="brand">OBJETIVOS 2026</div>
        <button className="link-button aboutLink" type="button" onClick={onOpenAbout}>
          ABOUT
        </button>
      </div>
    </header>
  );
}
