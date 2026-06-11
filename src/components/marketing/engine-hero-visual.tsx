import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

const assistants = ["Cursor", "VS Code", "ChatGPT"];

const engineTools = ["create_post", "list_posts", "publish"];

/**
 * Static hero diagram: AI assistants → dumpd! → live published output.
 */
export function EngineHeroVisual() {
  return (
    <div className="card overflow-hidden p-2 shadow-md sm:p-3">
      <div className="engine-visual">
        {/* Assistants */}
        <div className="engine-column">
          <p className="engine-column-label">AI Assistants</p>
          <div className="engine-assistants">
            {assistants.map((name) => (
              <span key={name} className="engine-chip">
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="engine-connector" aria-hidden="true">
          <span className="engine-connector-line" />
        </div>

        {/* Engine core */}
        <div className="engine-column engine-column-center">
          <div className="engine-node">
            <p className="engine-node-title">{BRAND_NAME}</p>
            <p className="engine-node-subtitle">{BRAND_TAGLINE}</p>
            <ul className="engine-tools">
              {engineTools.map((tool) => (
                <li key={tool} className="engine-tool">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="engine-connector" aria-hidden="true">
          <span className="engine-connector-line" />
        </div>

        {/* Output */}
        <div className="engine-column">
          <p className="engine-column-label">Live output</p>
          <div className="engine-output">
            <span className="badge-published">PUBLISHED</span>
            <p className="engine-output-title">Why I build in public</p>
            <p className="engine-output-url">/your-username/why-i-build-in-public</p>
            <p className="engine-output-meta">Portfolio · Topics · Markdown</p>
          </div>
        </div>
      </div>
    </div>
  );
}
