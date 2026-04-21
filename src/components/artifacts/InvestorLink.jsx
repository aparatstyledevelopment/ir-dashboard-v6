import { useArtifactsContext } from '../../hooks/useArtifacts';
import { slugify } from '../../utils/slug';

// Click-through to an investor profile. Instead of navigating, it opens
// the investor as an artifact in the right-side pane. Usage:
//   <InvestorLink name="Richard Brannemark" />
//   <InvestorLink slug="richard-brannemark">Link text</InvestorLink>
export default function InvestorLink({ name, slug, children, className = 'cb-link' }) {
  const { openArtifact } = useArtifactsContext();
  const investorSlug = slug || (name ? slugify(name) : null);

  const handleClick = (e) => {
    e.preventDefault();
    if (!investorSlug) return;
    openArtifact({ type: 'investor', payload: { slug: investorSlug } });
  };

  return (
    <a
      href={investorSlug ? `#/investor/${investorSlug}` : '#'}
      className={className}
      onClick={handleClick}
    >
      {children || name}
    </a>
  );
}
