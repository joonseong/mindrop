import { AppHeader, Main, Screen } from './ui';

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { h: string; p: string[] }[] }) {
  return (
    <Screen>
      <AppHeader layout="nav" title={title} back />
      <Main className="gap-6 pb-10 pt-4">
        <p className="text-sm text-txt-black-tertiary">시행일 {updated}</p>
        {sections.map(s => (
          <section key={s.h} className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">{s.h}</h2>
            {s.p.map(p => (
              <p key={p} className="text-base leading-7 text-txt-black-secondary">
                {p}
              </p>
            ))}
          </section>
        ))}
      </Main>
    </Screen>
  );
}
