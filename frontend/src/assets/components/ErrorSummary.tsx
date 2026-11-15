type ErrorSummaryProps = {
  errors: Record<string, string>
}

export default function ErrorSummary({ errors }: ErrorSummaryProps) {
  const messages = Object.entries(errors)

  if (messages.length === 0) return null

  return (
    <div
      role="alert"
      className="rounded border border-[#383838] border-l-4 bg-[#F2F2F2] p-3"
    >
      <h2 className="text-title text-base font-semibold">
        Please fix {messages.length} {messages.length === 1 ? 'error' : 'errors'}{' '}
        before submitting
      </h2>

      <ul className="mt-2 space-y-1 text-sm">
        {messages.map(([field, message]) => (
          <li key={field}>
            <a href={`#${field}`} className="underline">
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
