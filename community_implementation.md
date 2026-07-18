## 2. The Community Feed

* **Route:** `GET /api/community/feed?category={category}&before={cursor}`
* **Functionality:** Handled by `loadFeed()`. It fetches the latest `CommunityPost` objects. It supports filtering by mapping frontend categories (e.g., "Deal Insight") to API parameters (e.g., `deal_insight`). It also supports cursor-based pagination for infinite scrolling.
* **Frontend Display:** Rendered in the **Center Column**.
* Shows `<SkeletonPost/>` cards while initially loading.
* Renders an article card for each post containing the author's avatar, name, time posted, text body, and up to 4 images.
* Includes a category filter bar at the top ("All", "Deal Insight", etc.) and a "Load more" button at the bottom if a `nextCursor` is returned.



## 3. Bookmarks Feed

* **Route:** `GET /api/community/bookmarks?before={cursor}`
* **Functionality:** Triggered by `loadBookmarks()` when the user toggles the sub-navigation tab to "Bookmarks". Fetches posts the user has explicitly saved.
* **Frontend Display:** Replaces the main feed in the **Center Column** when the "Bookmarks" tab is active. The UI structure mirrors standard feed posts.

## 4. Creating a New Post (With Images)

* **Routes:**
1. `POST /api/community/uploads/presign` (To get secure upload URLs)
2. `PUT {uploadUrl}` (To upload the actual files directly to a storage bucket)
3. `POST /api/community/posts` (To submit the final post data)


* **Functionality:** Handled by `createPost()`. If the user attaches images, it first requests presigned URLs, uploads the files, retrieves the object keys, and then sends the text, image keys, and category to the final post route.
* **Frontend Display:** A `<form className="composer-card">` at the top of the feed.
* Features a text area and file input for images.
* Shows local object URL previews of selected images with an "x" button to remove them.
* Includes a required category dropdown.
* Button changes to "Posting..." and disables during the API calls. Upon success, the new post immediately prepends to the feed without a page refresh.



## 5. Liking and Bookmarking

* **Routes:**
* `POST /api/community/posts/{postId}/like`
* `POST /api/community/posts/{postId}/bookmark`


* **Functionality:** `toggleLike()` and `toggleBookmark()` send POST requests to toggle the boolean state on the backend. The API returns the updated state and counts.
* **Frontend Display:** Found in the `post-actions` footer of every post.
* **Like:** Heart icon that turns blue/active when `likedByMe` is true. Displays the total `likeCount`.
* **Bookmark:** Bookmark icon that turns active when `bookmarkedByMe` is true. If the user is viewing the "Bookmarks" tab and un-bookmarks a post, the UI immediately filters that post out of view.
* Buttons disable instantly upon click using a `busyIds` state to prevent duplicate requests.



## 6. Comments (Fetching and Posting)

* **Routes:**
* `GET /api/community/posts/{postId}/comments`
* `POST /api/community/posts/{postId}/comments`


* **Functionality:**
* **Fetching:** `loadComments()` is triggered automatically in the background for every post fetched in the feed.
* **Posting:** `submitComment()` pushes a new comment string to the backend.


* **Frontend Display:** Hidden by default. Clicking the "View Comments" button expands a section beneath the post.
* Displays a list of comments with author details and text.
* Provides an input field and "Post" button for new comments (`commentDrafts` state binds to the input).
* The total comment count on the post updates dynamically upon submission.



## 7. People Suggestions & Connections

* **Routes:**
* `GET /api/community/connections/suggestions`
* `GET /api/community/connections`


* **Functionality:** Fetched concurrently on mount via `loadCommunity()`. Retrieves the user's current friends/connections and a list of recommended users.
* **Frontend Display:** Rendered in the **Right Rail** under "People to Connect With".
* Shows a list of suggested user profiles with their name, handle, and a "Connect" button.
* Uses a `<SkeletonPerson/>` loader before the data resolves.



## 8. Managing Connection Requests

* **Routes:**
* `GET /api/community/connections/requests` (Fetch incoming)
* `POST /api/community/connections` (Send outgoing)
* `POST /api/community/connections/{requestId}/respond` (Accept/Reject)


* **Functionality:**
* **Sending:** `sendConnectionRequest()` is triggered when clicking "Connect" on a suggested user.
* **Responding:** `respondToRequest()` sends a status payload (`"accepted"` or `"rejected"`) to resolve an incoming request.


* **Frontend Display:**
* **Top Nav:** A bell icon shows a notification badge with the total number of incoming requests.
* **Right Rail:** Renders a "Connection Requests" panel showing the requester's details alongside Check (accept) and X (reject) action buttons.
* On a successful action, the lists refresh dynamically via `refreshConnections()`.