import React, { useState, useEffect } from "react";
import "./App.css";

export default function ContentDashboard() {
  // Load stored content from Local Storage on initial load
  const [contents, setContents] = useState(() => {
    const saved = localStorage.getItem("my_content_drafts");
    return saved ? JSON.parse(saved) : [];
  });

  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState("note"); // 'note' or 'video'
  const [body, setBody] = useState("");

  // Save to Local Storage whenever contents change
  useEffect(() => {
    localStorage.setItem("my_content_drafts", JSON.stringify(contents));
  }, [contents]);

  const handleSave = (status) => {
    if (!title || !body) {
      alert("Please enter both a title and your content!");
      return;
    }

    const newItem = {
      id: Date.now(),
      title,
      type,
      body,
      status, // 'draft' or 'published'
      date: new Date().toLocaleDateString(),
    };

    setContents([newItem, ...contents]);
    setTitle("");
    setBody("");
  };

  const handleDelete = (id) => {
    setContents(contents.filter((item) => item.id !== id));
  };

  const handlePublishDraft = (id) => {
    setContents(
      contents.map((item) =>
        item.id === id ? { ...item, status: "published" } : item,
      ),
    );
  };

const renderVideo = (url) => {
  let videoId = "";
  // Standard regex to catch different YouTube URL formats
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    videoId = match[2];
  }

  if (!videoId) {
    return <p className="error-text">Invalid or unsupported YouTube URL.</p>;
  }

  return (
    <iframe
      className="video-preview"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="Video player"
      frameBorder="0"
      allowFullScreen
    ></iframe>
  );
};

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Creator Studio</h1>
        <p>Draft, publish, and manage your content.</p>
      </header>

      <main className="dashboard-grid">
        {/* LEFT COLUMN: THE FORM */}
        <section className="form-section card">
          <h2>Create New Content</h2>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g., My Awesome Vlog"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Content Type</label>
            <div className="type-toggle">
              <button
                className={type === "note" ? "active" : ""}
                onClick={() => setType("note")}
              >
                📝 Note
              </button>
              <button
                className={type === "video" ? "active" : ""}
                onClick={() => setType("video")}
              >
                🎥 Video URL
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>{type === "note" ? "Your Notes" : "Video Link"}</label>
            {type === "note" ? (
              <textarea
                placeholder="Write your thoughts here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows="5"
              ></textarea>
            ) : (
              <input
                type="url"
                placeholder="Paste YouTube or Video URL..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            )}
          </div>

          <div className="button-group">
            <button
              className="btn btn-draft"
              onClick={() => handleSave("draft")}
            >
              Save as Draft
            </button>
            <button
              className="btn btn-publish"
              onClick={() => handleSave("published")}
            >
              Publish Now
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: THE CONTENT LIST */}
        <section className="content-list">
          <h2>Your Content</h2>
          {contents.length === 0 ? (
            <p className="empty-state">No content yet. Start drafting!</p>
          ) : (
            contents.map((item) => (
              <div key={item.id} className={`content-card ${item.status}`}>
                <div className="card-header">
                  <span className={`badge ${item.status}`}>
                    {item.status.toUpperCase()}
                  </span>
                  <span className="date">{item.date}</span>
                </div>

                <h3>{item.title}</h3>

                <div className="card-body">
                  {item.type === "note" ? (
                    <p className="note-text">{item.body}</p>
                  ) : (
                    renderVideo(item.body)
                  )}
                </div>

                <div className="card-actions">
                  {item.status === "draft" && (
                    <button
                      className="btn btn-publish-small"
                      onClick={() => handlePublishDraft(item.id)}
                    >
                      Publish Draft
                    </button>
                  )}
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
