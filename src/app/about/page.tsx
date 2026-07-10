export default function AboutPage() {
  return (
    <section className="space-y-8">
      <h1 className="text-4xl font-bold">About Project</h1>

      <p>
        This application is an interactive Swagger/OpenAPI editor developed as the final React
        course project at RS School.
      </p>

      <div>
        <h2 className="mb-2 text-2xl font-semibold">Team</h2>

        <ul className="space-y-2">
          <li>
            <strong>Anna</strong>
          </li>

          <li>
            <strong>Ulyana</strong>
          </li>

          <li>
            <strong>Kristina</strong>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="mb-2 text-2xl font-semibold">Technologies</h2>

        <ul className="list-disc pl-6">
          <li>Next.js</li>
          <li>React</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Swagger / OpenAPI</li>
        </ul>
      </div>
    </section>
  );
}
