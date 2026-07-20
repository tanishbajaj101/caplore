import { initialsFor } from "../../../utils/person";
import type { ConnectionRequest, Suggestion } from "../types";
import { CommunityIcon } from "./CommunityIcon";
import { Panel } from "./Panel";

type CommunityRightRailProps = {
  busyIds: Set<string>;
  requests: ConnectionRequest[];
  suggestions: Suggestion[];
  onRespondToRequest: (requestId: number, nextStatus: "accepted" | "rejected") => Promise<void>;
  onSendConnectionRequest: (receiverUsername: string) => Promise<void>;
};

export function CommunityRightRail({
  busyIds,
  requests,
  suggestions,
  onRespondToRequest,
  onSendConnectionRequest,
}: CommunityRightRailProps) {
  return (
    <aside className="community-right-rail">
      <Panel title="People to Connect With">
        <div className="people-list">
          {suggestions.map((person) => (
            <article key={person.username}>
              <a href={`/profile/${person.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <i>{initialsFor(person.name, person.username)}</i>
              </a>
              <div>
                <a href={`/profile/${person.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <strong>{person.name}</strong>
                </a>
                <span><a href={`/profile/${person.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>@{person.username}</a></span>
              </div>
              <button
                type="button"
                disabled={busyIds.has(`connect:${person.username}`)}
                onClick={() => void onSendConnectionRequest(person.username)}
              >
                Connect
              </button>
            </article>
          ))}
          {suggestions.length === 0 && <p className="community-status">No suggestions right now.</p>}
        </div>
      </Panel>

      {requests.length > 0 && (
        <Panel title="Connection Requests">
          <div className="request-list">
            {requests.map((request) => (
              <article key={request.id}>
                <a href={`/profile/${request.fromUser.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <i>{initialsFor(request.fromUser.name, request.fromUser.username)}</i>
                </a>
                <div>
                  <a href={`/profile/${request.fromUser.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <strong>{request.fromUser.name}</strong>
                  </a>
                  <span>wants to connect</span>
                </div>
                <div className="request-actions">
                  <button
                    type="button"
                    aria-label="Accept request"
                    disabled={busyIds.has(`respond:${request.id}`)}
                    onClick={() => void onRespondToRequest(request.id, "accepted")}
                  >
                    <CommunityIcon name="check" size={13} />
                  </button>
                  <button
                    className="reject"
                    type="button"
                    aria-label="Reject request"
                    disabled={busyIds.has(`respond:${request.id}`)}
                    onClick={() => void onRespondToRequest(request.id, "rejected")}
                  >
                    <CommunityIcon name="x" size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      )}
    </aside>
  );
}

