import type { JournalEntry } from "./journal-functions"

// Create a demo user if one doesn't exist
export function initializeDemoUser() {
  if (!localStorage.getItem("demo-user")) {
    localStorage.setItem(
      "demo-user",
      JSON.stringify({
        id: "demo-user-id",
        email: "demo@example.com",
        name: "Demo User",
      }),
    )
    console.log("Demo user initialized")
  }
}

// Initialize demo entries if none exist
export function initializeDemoEntries() {
  const existingEntries = localStorage.getItem("demo-entries")

  if (!existingEntries || JSON.parse(existingEntries).length === 0) {
    console.log("Initializing comprehensive demo entries")

    const today = new Date()
    const getDateDaysAgo = (daysAgo: number) => {
      const date = new Date(today)
      date.setDate(date.getDate() - daysAgo)
      return date.toISOString().split("T")[0]
    }

    const demoEntries: JournalEntry[] = [
      {
        id: "demo-1",
        title: "Starting Fresh with MoodMate",
        content:
          "Today marks a new chapter in my mental health journey. I've been struggling with anxiety and feeling overwhelmed by work lately, so I decided to try this journaling app. My therapist recommended keeping a daily journal to track my thoughts and emotions. I'm hoping this will help me identify patterns in my mood and develop better coping strategies. The AI analysis feature seems interesting - maybe it can spot things I miss about my own emotional patterns.",
        excerpt:
          "Today marks a new chapter in my mental health journey. I've been struggling with anxiety and feeling overwhelmed by work lately...",
        mood: "hopeful",
        tags: ["mental health", "new beginnings", "therapy", "anxiety"],
        date: getDateDaysAgo(0),
        emotion: "joy",
        emotion_probabilities: {
          joy: 0.6,
          neutral: 0.2,
          fear: 0.1,
          sadness: 0.05,
          anger: 0.03,
          disgust: 0.02,
        },
        ai_insights:
          "Your entry shows a positive mindset toward personal growth and self-care. The decision to start journaling demonstrates emotional awareness and proactive mental health management. Your openness to using technology and therapy together suggests a balanced approach to wellness.",
        ai_suggestions:
          "Continue this journaling practice daily, even if entries are brief. Consider setting a specific time each day for reflection. Since you mentioned anxiety, try incorporating breathing exercises or mindfulness techniques before writing to help center your thoughts.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-2",
        title: "The Weight of Expectations",
        content:
          "Had a difficult conversation with my parents today about my career choices. They still don't understand why I left my corporate job to pursue freelance work, even though I've been happier and more creative than ever. Mom kept asking when I'm going to 'get serious' about my future, and Dad mentioned how my cousin just got promoted to manager. I know they mean well, but their expectations feel suffocating sometimes. I wish they could see that success isn't just about climbing the corporate ladder. I'm making decent money, I love what I do, and I have time for my hobbies and relationships. Isn't that worth something?",
        excerpt:
          "Had a difficult conversation with my parents today about my career choices. They still don't understand why I left my corporate job...",
        mood: "frustrated",
        tags: ["family", "career", "expectations", "freelance", "identity"],
        date: getDateDaysAgo(1),
        emotion: "anger",
        emotion_probabilities: {
          anger: 0.4,
          sadness: 0.3,
          neutral: 0.15,
          fear: 0.1,
          joy: 0.03,
          disgust: 0.02,
        },
        ai_insights:
          "Your entry reveals a conflict between external expectations and personal fulfillment. You demonstrate strong self-awareness about your values and what brings you happiness, which is emotionally mature. The frustration stems from feeling misunderstood rather than uncertainty about your choices.",
        ai_suggestions:
          "Consider having a calm conversation with your parents about your specific achievements and future goals in freelancing. Sometimes concrete examples help others understand non-traditional paths. Remember that their concerns often come from love and their own experiences with security.",
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-3",
        title: "Loneliness in a Crowded Room",
        content:
          "Went to Sarah's birthday party tonight. Everyone seemed to be having such a good time, laughing and sharing stories, but I felt like I was watching from behind glass. I tried to join conversations, but I kept feeling like an outsider. Maybe it's because I've been working from home so much lately, or maybe I'm just out of practice with social situations. I used to be the life of the party in college. When did I become this person who feels anxious in groups? I left early, claiming I had a headache, but really I just couldn't shake the feeling that I didn't belong there. The drive home was quiet and I couldn't stop thinking about how isolated I've become.",
        excerpt:
          "Went to Sarah's birthday party tonight. Everyone seemed to be having such a good time, but I felt like I was watching from behind glass...",
        mood: "lonely",
        tags: ["social anxiety", "isolation", "friendship", "self-doubt"],
        date: getDateDaysAgo(3),
        emotion: "sadness",
        emotion_probabilities: {
          sadness: 0.5,
          fear: 0.25,
          neutral: 0.15,
          anger: 0.05,
          joy: 0.03,
          disgust: 0.02,
        },
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-4",
        title: "Small Victories",
        content:
          "Finally finished that project I've been procrastinating on for weeks! It wasn't as overwhelming as I made it out to be in my head. I think I have this habit of catastrophizing tasks until they seem impossible, when really they just need to be broken down into smaller steps. Today I just sat down and started, and before I knew it, I was in flow state. The client loved the final result too. I need to remember this feeling the next time I'm avoiding something. Maybe the anticipation is always worse than the actual doing. Treating myself to my favorite Thai food tonight as a celebration.",
        excerpt:
          "Finally finished that project I've been procrastinating on for weeks! It wasn't as overwhelming as I made it out to be in my head...",
        mood: "accomplished",
        tags: ["productivity", "procrastination", "success", "self-reflection"],
        date: getDateDaysAgo(5),
        emotion: "joy",
        emotion_probabilities: {
          joy: 0.7,
          neutral: 0.2,
          sadness: 0.04,
          fear: 0.03,
          anger: 0.02,
          disgust: 0.01,
        },
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-5",
        title: "The Comparison Trap",
        content:
          "Spent way too much time on Instagram today and now I feel terrible about myself. Everyone seems to be traveling to exotic places, getting engaged, buying houses, or landing dream jobs. Meanwhile, I'm sitting in my apartment in yesterday's clothes eating cereal for dinner. I know social media is just highlights, not real life, but it's hard not to compare. My rational brain knows that my college friend's perfect vacation photos don't show the credit card debt or relationship problems, but my emotional brain just sees 'everyone is doing better than me.' I need to be more intentional about my social media consumption. Maybe I should unfollow accounts that make me feel bad about myself.",
        excerpt:
          "Spent way too much time on Instagram today and now I feel terrible about myself. Everyone seems to be traveling to exotic places...",
        mood: "inadequate",
        tags: ["social media", "comparison", "self-esteem", "FOMO"],
        date: getDateDaysAgo(7),
        emotion: "sadness",
        emotion_probabilities: {
          sadness: 0.45,
          neutral: 0.25,
          anger: 0.15,
          fear: 0.1,
          joy: 0.03,
          disgust: 0.02,
        },
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-6",
        title: "Unexpected Kindness",
        content:
          "The strangest thing happened today. I was having a rough morning - spilled coffee on my shirt, missed the bus, and was running late for my dentist appointment. When I finally got there, frazzled and apologetic, the receptionist just smiled and said 'Don't worry, we've all been there. Dr. Martinez is running a few minutes behind anyway.' Then she offered me a coffee and asked if I needed anything else. Such a small gesture, but it completely shifted my mood. It reminded me how much power we have to affect each other's days, just through basic kindness. I want to be more like that receptionist - someone who makes people feel better just by being around them.",
        excerpt:
          "The strangest thing happened today. I was having a rough morning - spilled coffee on my shirt, missed the bus, and was running late...",
        mood: "grateful",
        tags: ["kindness", "human connection", "perspective", "gratitude"],
        date: getDateDaysAgo(9),
        emotion: "joy",
        emotion_probabilities: {
          joy: 0.65,
          neutral: 0.25,
          sadness: 0.05,
          fear: 0.03,
          anger: 0.01,
          disgust: 0.01,
        },
        created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-7",
        title: "The Anxiety Spiral",
        content:
          "Woke up at 3 AM with my heart racing and couldn't get back to sleep. My mind was spinning with worst-case scenarios about everything - work deadlines, money, health, relationships. The rational part of me knows these middle-of-the-night fears are usually overblown, but in the darkness, everything feels catastrophic. I tried the breathing exercises my therapist taught me, but my chest still felt tight. Finally got up and made some chamomile tea, did some gentle stretching, and wrote down my worries. Seeing them on paper made them seem more manageable somehow. I think I need to be better about my sleep hygiene and maybe cut back on caffeine after 2 PM.",
        excerpt:
          "Woke up at 3 AM with my heart racing and couldn't get back to sleep. My mind was spinning with worst-case scenarios about everything...",
        mood: "anxious",
        tags: ["anxiety", "sleep", "worry", "coping strategies", "therapy"],
        date: getDateDaysAgo(11),
        emotion: "fear",
        emotion_probabilities: {
          fear: 0.6,
          sadness: 0.2,
          neutral: 0.15,
          anger: 0.03,
          joy: 0.01,
          disgust: 0.01,
        },
        created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-8",
        title: "Rediscovering Old Passions",
        content:
          "Found my old guitar in the closet today while looking for winter clothes. Haven't played in probably three years, but I sat down and started strumming some chords. My fingers were clumsy and the calluses are long gone, but muscle memory is amazing - I could still play most of 'Wonderwall' (yes, I'm that person). It felt so good to create something, even if it was just noise to my neighbors. I used to write songs in college and even played a few open mic nights. I wonder why I stopped. Probably got caught up in 'adult responsibilities' and convinced myself I didn't have time for 'frivolous' things. But making music never felt frivolous - it felt necessary. Maybe it's time to make space for it again.",
        excerpt:
          "Found my old guitar in the closet today while looking for winter clothes. Haven't played in probably three years, but I sat down and started strumming...",
        mood: "nostalgic",
        tags: ["music", "creativity", "hobbies", "self-discovery", "priorities"],
        date: getDateDaysAgo(13),
        emotion: "joy",
        emotion_probabilities: {
          joy: 0.55,
          neutral: 0.25,
          sadness: 0.15,
          fear: 0.03,
          anger: 0.01,
          disgust: 0.01,
        },
        created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-9",
        title: "The Weight of Perfectionism",
        content:
          "Spent four hours today rewriting the same email three times because I couldn't get the tone right. It was just a simple follow-up to a potential client, but I kept second-guessing every word. Too casual? Too formal? Too pushy? Not assertive enough? By the time I finally sent it, I was exhausted and frustrated with myself. This perfectionism is becoming a real problem. I waste so much time and energy trying to make everything perfect that I often end up paralyzed instead of productive. My therapist says perfectionism is really just fear in disguise - fear of judgment, failure, not being good enough. She's probably right. I need to practice 'good enough' and remember that done is better than perfect.",
        excerpt:
          "Spent four hours today rewriting the same email three times because I couldn't get the tone right. It was just a simple follow-up...",
        mood: "frustrated",
        tags: ["perfectionism", "productivity", "self-criticism", "fear", "therapy"],
        date: getDateDaysAgo(15),
        emotion: "anger",
        emotion_probabilities: {
          anger: 0.35,
          sadness: 0.3,
          fear: 0.2,
          neutral: 0.1,
          joy: 0.03,
          disgust: 0.02,
        },
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-10",
        title: "Connection in Unexpected Places",
        content:
          "Had the most interesting conversation with my Uber driver today. Usually I just put in headphones and zone out, but something about his energy made me actually engage. Turns out he's a retired teacher who drives part-time to stay busy and meet people. He told me about his students, his travels, his philosophy on life. He said something that really stuck with me: 'Everyone you meet is fighting a battle you know nothing about, so be kind.' We talked about everything from books to cooking to the meaning of life. By the time we reached my destination, I felt more connected to humanity than I have in weeks. It's funny how a 20-minute car ride with a stranger can remind you that we're all just trying to figure it out together.",
        excerpt:
          "Had the most interesting conversation with my Uber driver today. Usually I just put in headphones and zone out, but something about his energy...",
        mood: "connected",
        tags: ["human connection", "wisdom", "strangers", "perspective", "kindness"],
        date: getDateDaysAgo(17),
        emotion: "joy",
        emotion_probabilities: {
          joy: 0.7,
          neutral: 0.2,
          sadness: 0.05,
          fear: 0.03,
          anger: 0.01,
          disgust: 0.01,
        },
        created_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-11",
        title: "The Sunday Scaries",
        content:
          "Sunday evening dread is hitting hard tonight. That familiar knot in my stomach that shows up every week around 6 PM, reminding me that Monday is coming. I know I should be grateful for my job - it pays well and my coworkers are decent - but I can't shake the feeling that I'm just going through the motions. Is this what adult life is supposed to feel like? This constant cycle of working for the weekend, then dreading the end of the weekend? I see people who seem genuinely excited about their work and I wonder what I'm missing. Maybe it's time to seriously think about what I actually want to do with my life, not just what I fell into after college. The thought is both terrifying and exciting.",
        excerpt:
          "Sunday evening dread is hitting hard tonight. That familiar knot in my stomach that shows up every week around 6 PM...",
        mood: "restless",
        tags: ["career dissatisfaction", "Sunday scaries", "life purpose", "existential", "work"],
        date: getDateDaysAgo(19),
        emotion: "sadness",
        emotion_probabilities: {
          sadness: 0.4,
          fear: 0.3,
          neutral: 0.2,
          anger: 0.07,
          joy: 0.02,
          disgust: 0.01,
        },
        created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-12",
        title: "Boundaries and Guilt",
        content:
          "Had to say no to my friend Emma's request to help her move this weekend, and I feel terrible about it. I already had plans and honestly, I'm just exhausted from a busy week. But the guilt is eating at me. She sounded disappointed, and I keep replaying the conversation in my head. Why is it so hard for me to set boundaries without feeling like a bad person? I know I can't be everything to everyone, and I know my time and energy are valuable, but saying no still feels selfish. My therapist would probably say this is people-pleasing behavior and that I need to practice self-compassion. Easier said than done. I'm going to try to enjoy my weekend plans without the guilt cloud hanging over me.",
        excerpt:
          "Had to say no to my friend Emma's request to help her move this weekend, and I feel terrible about it. I already had plans and honestly...",
        mood: "guilty",
        tags: ["boundaries", "guilt", "friendship", "people-pleasing", "self-care"],
        date: getDateDaysAgo(21),
        emotion: "sadness",
        emotion_probabilities: {
          sadness: 0.45,
          fear: 0.25,
          neutral: 0.2,
          anger: 0.07,
          joy: 0.02,
          disgust: 0.01,
        },
        created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-13",
        title: "The Power of Routine",
        content:
          "Three weeks into my new morning routine and I'm actually starting to see the benefits. Waking up 30 minutes earlier to meditate, journal, and have a proper breakfast instead of rushing out the door with a granola bar. I was skeptical at first - I'm definitely not a morning person - but there's something powerful about starting the day intentionally instead of reactively. I feel more grounded, less scattered. Even my coworkers have commented that I seem calmer lately. It's amazing how such a small change can ripple through the rest of the day. The key was starting small and being consistent rather than trying to overhaul everything at once. Maybe I'll add a short walk to the routine next month.",
        excerpt:
          "Three weeks into my new morning routine and I'm actually starting to see the benefits. Waking up 30 minutes earlier to meditate, journal...",
        mood: "proud",
        tags: ["routine", "self-improvement", "meditation", "consistency", "growth"],
        date: getDateDaysAgo(23),
        emotion: "joy",
        emotion_probabilities: {
          joy: 0.6,
          neutral: 0.3,
          sadness: 0.05,
          fear: 0.03,
          anger: 0.01,
          disgust: 0.01,
        },
        created_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-14",
        title: "Childhood Memories and Healing",
        content:
          "Therapy session today brought up some childhood stuff I haven't thought about in years. We were talking about my tendency to minimize my own needs, and Dr. Chen asked about my family dynamics growing up. I realized how much I learned to be 'the easy kid' - never asking for too much, always trying to keep everyone happy. My parents were dealing with my brother's behavioral issues, and I think I unconsciously decided that being low-maintenance was my role in the family. It's wild how those early patterns still show up in my adult relationships. I'm 28 and still apologizing for taking up space. But awareness is the first step, right? It's painful to look at this stuff, but I can already feel something shifting just by naming it.",
        excerpt:
          "Therapy session today brought up some childhood stuff I haven't thought about in years. We were talking about my tendency to minimize my own needs...",
        mood: "reflective",
        tags: ["therapy", "childhood", "family dynamics", "healing", "self-awareness"],
        date: getDateDaysAgo(25),
        emotion: "sadness",
        emotion_probabilities: {
          sadness: 0.4,
          neutral: 0.35,
          fear: 0.15,
          joy: 0.07,
          anger: 0.02,
          disgust: 0.01,
        },
        ai_insights:
          "Your entry demonstrates significant emotional intelligence and courage in exploring difficult childhood patterns. The connection you're making between past family dynamics and current behavior shows healthy self-reflection. Recognizing your role as 'the easy kid' is a major breakthrough in understanding your people-pleasing tendencies.",
        ai_suggestions:
          "Continue this therapeutic work with patience and self-compassion. Consider practicing small acts of self-advocacy in low-stakes situations to build confidence. Remember that healing isn't linear - some days will feel harder than others, and that's completely normal.",
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-15",
        title: "The Art of Letting Go",
        content:
          "Cleaned out my closet today and found a box of letters from my ex. We broke up two years ago, but I've been holding onto these like some kind of emotional security blanket. Reading through them brought back all the good memories - inside jokes, future plans we made, the way he used to write about how much he believed in me. But it also reminded me why we didn't work out. We wanted different things, were at different life stages, and no amount of love could bridge that gap. I finally threw the letters away. Not out of anger or bitterness, but out of acceptance. I'm grateful for what we had, but I'm ready to stop living in the past. It felt surprisingly liberating to let go of that chapter and make space for whatever comes next.",
        excerpt:
          "Cleaned out my closet today and found a box of letters from my ex. We broke up two years ago, but I've been holding onto these...",
        mood: "liberated",
        tags: ["letting go", "relationships", "closure", "growth", "moving on"],
        date: getDateDaysAgo(27),
        emotion: "joy",
        emotion_probabilities: {
          joy: 0.5,
          sadness: 0.25,
          neutral: 0.2,
          fear: 0.03,
          anger: 0.01,
          disgust: 0.01,
        },
        created_at: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
      {
        id: "demo-16",
        title: "Imposter Syndrome Strikes Again",
        content:
          "Got invited to speak on a panel about freelancing next month and my first thought wasn't excitement - it was panic. Who am I to give advice? What if they find out I'm just making it up as I go along? I've been freelancing successfully for two years, have happy clients, and make good money, but I still feel like I'm pretending to be a 'real' professional. This imposter syndrome is exhausting. I know logically that everyone feels this way sometimes, that expertise is a spectrum not a destination, but the feeling persists. Maybe the fact that I care so much about doing well is actually a good sign? I'm going to say yes to the panel. Even if I'm terrified, I have valuable experiences to share. And maybe hearing my own story out loud will help me believe in myself a little more.",
        excerpt:
          "Got invited to speak on a panel about freelancing next month and my first thought wasn't excitement - it was panic. Who am I to give advice?",
        mood: "insecure",
        tags: ["imposter syndrome", "career", "self-doubt", "public speaking", "growth"],
        date: getDateDaysAgo(29),
        emotion: "fear",
        emotion_probabilities: {
          fear: 0.5,
          neutral: 0.25,
          sadness: 0.15,
          anger: 0.07,
          joy: 0.02,
          disgust: 0.01,
        },
        created_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: "demo-user-id",
        source: "localStorage-demo",
      },
    ]

    localStorage.setItem("demo-entries", JSON.stringify(demoEntries))
    console.log("Comprehensive demo entries initialized:", demoEntries.length, "entries")
  } else {
    console.log("Demo entries already exist")
  }
}

// Initialize all demo data
export function initializeDemoData() {
  console.log("Initializing comprehensive demo data")
  initializeDemoUser()
  initializeDemoEntries()
}
