import React from 'react'
import { GetAllCompanions } from '../../lib/actions/companions.actions';
import CompanionCard from '@/components/CompanionCard';
import { getSubjectColor } from '../../lib/utils';
import SearchInput from '@/components/SearchInput';
import SubjectFilter from '@/components/SubjectFilter';

const CompanionLibrary = async ({ searchParams }: SearchParams) => {

  const params = await searchParams;
  const subject = params.subject ? params.subject : '';
  const topic = params.topic ? params.topic : '';

  const companions = await GetAllCompanions({ subject, topic });
  // console.log('Companions:', companions);

  return (
    <main>
      <section className='flex justify-between gap-4 sm:flex-col'>
        <h1>Companion Library</h1>
        <div className='flex gap-4 '>
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>
      <section className='companions-grid'>
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>
    </main>
  )
}

export default CompanionLibrary
