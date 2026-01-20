import { UI_TEXT } from '../../constants';
import Button from '../UI/Button';

interface Props {
  onOpenAbout(): void;
}

export default function Header({ onOpenAbout }: Props) {
  return (
    <header className="topHeader">
      <div className="topHeaderInner layoutGrid">
        <div className="brand">{UI_TEXT.brand}</div>
        <Button className="link-button aboutLink" onClick={onOpenAbout}>
          {UI_TEXT.about}
        </Button>
      </div>
    </header>
  );
}
