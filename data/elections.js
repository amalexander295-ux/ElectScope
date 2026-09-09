/* =========================================================
   ElectScope Election Data
   Presidential electoral-vote allocations

   Historical allocations are stored separately so changing
   one election cycle never changes another.
   ========================================================= */

const ELECTION_DATA = {

    /* =====================================================
       2020 PRESIDENTIAL ELECTION
       2010 Census apportionment
       ===================================================== */

    2020: {
        president: {
            totalElectoralVotes: 538,

            electoralVotes: {
                AL: 9,
                AK: 3,
                AZ: 11,
                AR: 6,
                CA: 55,
                CO: 9,
                CT: 7,
                DE: 3,
                DC: 3,
                FL: 29,
                GA: 16,
                HI: 4,
                ID: 4,
                IL: 20,
                IN: 11,
                IA: 6,
                KS: 6,
                KY: 8,
                LA: 8,
                ME: 2,
                MD: 10,
                MA: 11,
                MI: 16,
                MN: 10,
                MS: 6,
                MO: 10,
                MT: 3,
                NE: 2,
                NV: 6,
                NH: 4,
                NJ: 14,
                NM: 5,
                NY: 29,
                NC: 15,
                ND: 3,
                OH: 18,
                OK: 7,
                OR: 7,
                PA: 20,
                RI: 4,
                SC: 9,
                SD: 3,
                TN: 11,
                TX: 38,
                UT: 6,
                VT: 3,
                VA: 13,
                WA: 12,
                WV: 5,
                WI: 10,
                WY: 3,

                /* Maine split electoral votes */
                "ME-01": 1,
                "ME-02": 1,

                /* Nebraska split electoral votes */
                "NE-01": 1,
                "NE-02": 1,
                "NE-03": 1
            }
        }
    },

    /* =====================================================
       2024 PRESIDENTIAL ELECTION
       2020 Census apportionment
       ===================================================== */

    2024: {
        president: {
            totalElectoralVotes: 538,

            electoralVotes: {
                AL: 9,
                AK: 3,
                AZ: 11,
                AR: 6,
                CA: 54,
                CO: 10,
                CT: 7,
                DE: 3,
                DC: 3,
                FL: 30,
                GA: 16,
                HI: 4,
                ID: 4,
                IL: 19,
                IN: 11,
                IA: 6,
                KS: 6,
                KY: 8,
                LA: 8,
                ME: 2,
                MD: 10,
                MA: 11,
                MI: 15,
                MN: 10,
                MS: 6,
                MO: 10,
                MT: 4,
                NE: 2,
                NV: 6,
                NH: 4,
                NJ: 14,
                NM: 5,
                NY: 28,
                NC: 16,
                ND: 3,
                OH: 17,
                OK: 7,
                OR: 8,
                PA: 19,
                RI: 4,
                SC: 9,
                SD: 3,
                TN: 11,
                TX: 40,
                UT: 6,
                VT: 3,
                VA: 13,
                WA: 12,
                WV: 4,
                WI: 10,
                WY: 3,

                /* Maine split electoral votes */
                "ME-01": 1,
                "ME-02": 1,

                /* Nebraska split electoral votes */
                "NE-01": 1,
                "NE-02": 1,
                "NE-03": 1
            }
        }
    },

    /* =====================================================
       2028 PRESIDENTIAL ELECTION
       Same 2020 Census allocation used for 2024
       ===================================================== */

    2028: {
        president: {
            totalElectoralVotes: 538,

            electoralVotes: {
                AL: 9,
                AK: 3,
                AZ: 11,
                AR: 6,
                CA: 54,
                CO: 10,
                CT: 7,
                DE: 3,
                DC: 3,
                FL: 30,
                GA: 16,
                HI: 4,
                ID: 4,
                IL: 19,
                IN: 11,
                IA: 6,
                KS: 6,
                KY: 8,
                LA: 8,
                ME: 2,
                MD: 10,
                MA: 11,
                MI: 15,
                MN: 10,
                MS: 6,
                MO: 10,
                MT: 4,
                NE: 2,
                NV: 6,
                NH: 4,
                NJ: 14,
                NM: 5,
                NY: 28,
                NC: 16,
                ND: 3,
                OH: 17,
                OK: 7,
                OR: 8,
                PA: 19,
                RI: 4,
                SC: 9,
                SD: 3,
                TN: 11,
                TX: 40,
                UT: 6,
                VT: 3,
                VA: 13,
                WA: 12,
                WV: 4,
                WI: 10,
                WY: 3,

                /* Maine split electoral votes */
                "ME-01": 1,
                "ME-02": 1,

                /* Nebraska split electoral votes */
                "NE-01": 1,
                "NE-02": 1,
                "NE-03": 1
            }
        }
    }
};


/* =========================================================
   Helper Functions
   ========================================================= */

/**
 * Returns presidential election data for a given year.
 */
function getPresidentialElectionData(year) {
    const election = ELECTION_DATA[year];

    if (!election || !election.president) {
        return null;
    }

    return election.president;
}


/**
 * Returns the official EV value for a state or district.
 */
function getOfficialElectoralVotes(year, region) {
    const election = getPresidentialElectionData(year);

    if (!election) {
        return 0;
    }

    return election.electoralVotes[region] || 0;
}


/**
 * Calculates the majority required to win.
 *
 * 538 total EV:
 * floor(538 / 2) + 1 = 270
 *
 * This also allows future custom maps to use totals other
 * than 538 without hard-coding the majority threshold.
 */
function calculateElectoralMajority(totalElectoralVotes) {
    return Math.floor(totalElectoralVotes / 2) + 1;
}
