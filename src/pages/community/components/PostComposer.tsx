import type { ChangeEvent, FormEvent } from "react";
import { CommunityIcon } from "./CommunityIcon";

type PostComposerProps = {
  initials: string;
  postFiles: File[];
  postText: string;
  posting: boolean;
  previews: string[];
  onChangeText: (text: string) => void;
  onFilesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function PostComposer({
  initials,
  postFiles,
  postText,
  posting,
  previews,
  onChangeText,
  onFilesChange,
  onRemoveImage,
  onSubmit,
}: PostComposerProps) {
  return (
    <form className="composer-card" onSubmit={onSubmit}>
      <div className="composer-main-row">
        <i>{initials}</i>
        <textarea
          value={postText}
          onChange={(event) => onChangeText(event.target.value)}
          placeholder="Share a deal insight, market update, or question with your network..."
          maxLength={4000}
        />
      </div>
      {postFiles.length > 0 && (
        <div className="composer-preview">
          {postFiles.map((file, index) => (
            <figure key={`${file.name}-${index}`}>
              <img src={previews[index]} alt={file.name} />
              <button type="button" aria-label="Remove image" onClick={() => onRemoveImage(index)}>
                <CommunityIcon name="x" size={12} />
              </button>
            </figure>
          ))}
        </div>
      )}
      <footer>
        <div className="composer-tools">
          <label>
            <CommunityIcon name="image" size={14} />
            Image
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={onFilesChange} />
          </label>
        </div>
        <button className="post-submit" type="submit" disabled={posting || !postText.trim()}>
          {posting ? "Posting..." : "Post"}
        </button>
      </footer>
    </form>
  );
}

