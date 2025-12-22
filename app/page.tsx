import CompanionCard from "@/components/CompanionCard"
import CompanionsList from "@/components/CompanionsList"
import CTA from "@/components/CTA"
import { GetAllCompanions, getRecentSessions } from "../lib/actions/companions.actions"
import { getSubjectColor } from "../lib/utils"

export const dynamic = 'force-dynamic'

const Page = async() => {
  const companions = await GetAllCompanions({limit:3})
  const recentSession = await getRecentSessions()
  return (
    <div className="md:px-40 ">
      <h1>Popular Companions</h1>

      <section className="home-section mt-5 ">
        {companions.map((companion) => (
                <CompanionCard
                    key={companion.id}
                    {...companion}
                    color={getSubjectColor(companion.subject)}
                />
          ))}
        
      </section>

      <section className="home-section mt-16">

        <CompanionsList 
          title="Recently Completed Session"
          companions={recentSession}
          classNames="w-2/3 max-lg:w-full"
        />

        <CTA />
      </section>


    </div>
  )
}

export default Page