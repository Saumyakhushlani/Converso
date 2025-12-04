import CompanionCard from "@/components/CompanionCard"
import CompanionsList from "@/components/CompanionsList"
import CTA from "@/components/CTA"
import { recentSessions } from "../constants"
const Page = () => {
  return (
    <div className="md:px-40 ">
      <h1>Popular Companions</h1>

      <section className="home-section mt-5 ">
        <CompanionCard
          id="123"
          name="Companion Name"
          topic="Companion Topic"
          subject="Companion Subject"
          duration={45}
          color="#ffda6e"
        />
        <CompanionCard 
          id="124"
          name="Another Companion"
          topic="Another Topic"
          subject="Another Subject"
          duration={30}
          color="#e5d0ff"
        />
        <CompanionCard 
          id="125"
          name="Another Companion"
          topic="Another Topic"
          subject="Another Subject"
          duration={30}
          color="#BDE7ff"
        />
      </section>

      <section className="home-section mt-16">

        <CompanionsList 
          title="Recently Completed Session"
          companions={recentSessions}
          classNames="w-2/3 max-lg:w-full"
        />

        <CTA />
      </section>


    </div>
  )
}

export default Page