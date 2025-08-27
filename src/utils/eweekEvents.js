// E-Week 2025 Events Configuration
export const EWEEK_2025_EVENTS = {
  "Team Events": [
    {
      name: "CRICKET",
      maxParticipants: 11,
      description: "Traditional cricket tournament with 11 players per team",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "FOOTBALL",
      maxParticipants: 11,
      description: "Football championship with 11 players per team",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "BASKET BALL",
      maxParticipants: 5,
      description: "Basketball tournament with 5 players per team",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "VOLLEY BALL",
      maxParticipants: 6,
      description: "Volleyball competition with 6 players per team",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "NETBALL",
      maxParticipants: 7,
      description: "Netball championship with 7 players per team",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "ELLE DEBATING",
      maxParticipants: 3,
      description: "Team debating competition with 3 members per team",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "BADMINTON",
      maxParticipants: 2,
      description: "Badminton doubles tournament with 2 players per team",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "TABLE TENNIS",
      maxParticipants: 2,
      description: "Table tennis doubles with 2 players per team",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "CARROM",
      maxParticipants: 2,
      description: "Carrom doubles championship with 2 players per team",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "CHESS",
      maxParticipants: 1,
      description: "Individual chess tournament representing teams",
      pointsConfig: [10, 8, 6, 4]
    }
  ],
  "Aesthetic Events": [
    {
      name: "SINGING",
      maxParticipants: 5,
      description: "Group singing competition with up to 5 performers",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "DANCING",
      maxParticipants: 8,
      description: "Group dancing performance with up to 8 dancers",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "POETRY",
      maxParticipants: 1,
      description: "Individual poetry recitation competition",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "ART",
      maxParticipants: 1,
      description: "Individual art creation competition",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "DRAMA",
      maxParticipants: 10,
      description: "Team drama performance with up to 10 actors",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "SHORT FILM",
      maxParticipants: 6,
      description: "Short film creation with up to 6 team members",
      pointsConfig: [10, 8, 6, 4]
    }
  ],
  "Digital Day": [
    {
      name: "SOLIDWORKS COMPETITION",
      maxParticipants: 1,
      description: "Individual SolidWorks 3D modeling competition",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "GRAPHIC DESIGN COMPETITION",
      maxParticipants: 1,
      description: "Individual graphic design challenge",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "GAMING COMPETITION",
      maxParticipants: 1,
      description: "Individual gaming tournament",
      pointsConfig: [10, 8, 6, 4]
    }
  ],
  "Individual Events": [
    {
      name: "100m",
      maxParticipants: 1,
      description: "100 meter sprint race",
      pointsConfig: [10, 8, 6, 4, 2]
    },
    {
      name: "200m",
      maxParticipants: 1,
      description: "200 meter sprint race",
      pointsConfig: [10, 8, 6, 4, 2]
    },
    {
      name: "400m",
      maxParticipants: 1,
      description: "400 meter sprint race",
      pointsConfig: [10, 8, 6, 4, 2]
    },
    {
      name: "800m",
      maxParticipants: 1,
      description: "800 meter middle distance race",
      pointsConfig: [10, 8, 6, 4, 2]
    },
    {
      name: "1500m",
      maxParticipants: 1,
      description: "1500 meter long distance race",
      pointsConfig: [10, 8, 6, 4, 2]
    },
    {
      name: "4 x 100m",
      maxParticipants: 4,
      description: "4 x 100m relay race with 4 runners",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "4 x 400m",
      maxParticipants: 4,
      description: "4 x 400m relay race with 4 runners",
      pointsConfig: [10, 8, 6, 4]
    },
    {
      name: "100m Hurdles",
      maxParticipants: 1,
      description: "100 meter hurdles race",
      pointsConfig: [10, 8, 6, 4, 2]
    },
    {
      name: "Shot put",
      maxParticipants: 1,
      description: "Shot put throwing competition",
      pointsConfig: [10, 8, 6, 4, 2]
    },
    {
      name: "Long jump",
      maxParticipants: 1,
      description: "Long jump athletics event",
      pointsConfig: [10, 8, 6, 4, 2]
    },
    {
      name: "Discuss Throw",
      maxParticipants: 1,
      description: "Discus throwing competition",
      pointsConfig: [10, 8, 6, 4, 2]
    },
    {
      name: "High jump",
      maxParticipants: 1,
      description: "High jump athletics event",
      pointsConfig: [10, 8, 6, 4, 2]
    },
    {
      name: "Javelin Throw",
      maxParticipants: 1,
      description: "Javelin throwing competition",
      pointsConfig: [10, 8, 6, 4, 2]
    }
  ]
};

// Helper function to get all event names
export const getAllEventNames = () => {
  const allEvents = [];
  Object.values(EWEEK_2025_EVENTS).forEach(categoryEvents => {
    categoryEvents.forEach(event => {
      allEvents.push(event.name);
    });
  });
  return allEvents;
};

// Helper function to get event by name
export const getEventByName = (eventName) => {
  for (const [category, events] of Object.entries(EWEEK_2025_EVENTS)) {
    const event = events.find(e => e.name === eventName);
    if (event) {
      return { ...event, category };
    }
  }
  return null;
};

// Helper function to get events by category
export const getEventsByCategory = (category) => {
  return EWEEK_2025_EVENTS[category] || [];
};

// Helper function to get all categories
export const getCategories = () => {
  return Object.keys(EWEEK_2025_EVENTS);
};

// Default event configuration
export const DEFAULT_EVENT_CONFIG = {
  status: "upcoming",
  maxTeamsPerBatch: 50,
  expectedFinishTime: "",
  winners: "",
  firstRunnerUp: "",
  secondRunnerUp: "",
  thirdRunnerUp: ""
};
