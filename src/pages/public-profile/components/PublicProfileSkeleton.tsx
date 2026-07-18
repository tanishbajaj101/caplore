export function PublicProfileSkeleton() {
  return (
    <div className="pub-profile-card">
      <div className="pub-profile-cover pub-skeleton" />
      <span className="pub-profile-avatar pub-skeleton" />
      <div className="pub-profile-body">
        <span className="pub-skeleton pub-skeleton-name" />
        <span className="pub-skeleton pub-skeleton-sub" />
      </div>
      <div className="pub-profile-stats">
        <div className="pub-stat-cell">
          <span className="pub-skeleton pub-skeleton-num" />
          <span className="pub-skeleton pub-skeleton-lbl" />
        </div>
        <div className="pub-stat-cell">
          <span className="pub-skeleton pub-skeleton-num" />
          <span className="pub-skeleton pub-skeleton-lbl" />
        </div>
        <div className="pub-stat-cell">
          <span className="pub-skeleton pub-skeleton-num" />
          <span className="pub-skeleton pub-skeleton-lbl" />
        </div>
      </div>
    </div>
  );
}
