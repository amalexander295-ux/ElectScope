/* =========================================================
   ElectScope Maps
   Presidential Map Engine
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PAGE ELEMENTS
       ===================================================== */

    const mapObject =
        document.getElementById("election-map");

    const yearSelect =
        document.getElementById("election-year");

    const mapTitle =
        document.getElementById("map-title");

    const majorityNumber =
        document.getElementById("majority-number");

    const democratTotal =
        document.getElementById("democrat-total");

    const republicanTotal =
        document.getElementById("republican-total");

    const selectedName =
        document.getElementById("selected-state-name");

    const selectedDescription =
        document.getElementById("selected-state-description");

    const selectedIcon =
        document.getElementById("selected-state-icon");

    const partyButtons =
        document.querySelectorAll("[data-party]");

    const ratingButtons =
        document.querySelectorAll("[data-rating]");


    if (!mapObject || !yearSelect || !mapTitle) {

        console.error(
            "ElectScope: required map elements are missing."
        );

        return;
    }


    /* =====================================================
       SUPPORTED PRESIDENTIAL YEARS
       ===================================================== */

    const PRESIDENTIAL_YEARS = [
        2028,
        2024,
        2020
    ];


    /* =====================================================
       PRESIDENTIAL ELECTORAL VOTES
       ===================================================== */

    const PRESIDENTIAL_EV = {

        2020: {
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

            "ME-AL": 2,
            "ME-01": 1,
            "ME-02": 1,

            MD: 10,
            MA: 11,
            MI: 16,
            MN: 10,
            MS: 6,
            MO: 10,
            MT: 3,

            "NE-AL": 2,
            "NE-01": 1,
            "NE-02": 1,
            "NE-03": 1,

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
            WY: 3
        },


        2024: {
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

            "ME-AL": 2,
            "ME-01": 1,
            "ME-02": 1,

            MD: 10,
            MA: 11,
            MI: 15,
            MN: 10,
            MS: 6,
            MO: 10,
            MT: 4,

            "NE-AL": 2,
            "NE-01": 1,
            "NE-02": 1,
            "NE-03": 1,

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
            WY: 3
        },


        2028: {
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

            "ME-AL": 2,
            "ME-01": 1,
            "ME-02": 1,

            MD: 10,
            MA: 11,
            MI: 15,
            MN: 10,
            MS: 6,
            MO: 10,
            MT: 4,

            "NE-AL": 2,
            "NE-01": 1,
            "NE-02": 1,
            "NE-03": 1,

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
            WY: 3
        }

    };


    /* =====================================================
       MAP STATE
       ===================================================== */

    let svgDocument = null;

    let currentYear = 2028;

    let currentElectoralVotes =
        PRESIDENTIAL_EV[currentYear];

    let selectedRegion = null;

    let selectedParty = null;

    const assignments = {};


    /* =====================================================
       COLORS
       ===================================================== */

    const colors = {

        democrat: {
            tossup: "#AAB2BD",
            tilt: "#CBD6DF",
            lean: "#9EC1DA",
            likely: "#5CA0D3",
            solid: "#0375C9"
        },

        republican: {
            tossup: "#AAB2BD",
            tilt: "#DFCBCF",
            lean: "#DA9FAA",
            likely: "#D35E73",
            solid: "#C9062A"
        },

        other: {
            tossup: "#AAB2BD",
            tilt: "#E5D8EF",
            lean: "#D3B1EB",
            likely: "#BB81E9",
            solid: "#A14AE6"
        }

    };

    const neutralFill = "#D7DEE7";


    /* =====================================================
       BUILD PRESIDENTIAL YEAR DROPDOWN
       ===================================================== */

    function buildYearDropdown() {

        yearSelect.innerHTML = "";

        PRESIDENTIAL_YEARS.forEach(function (year) {

            const option =
                document.createElement("option");

            option.value =
                String(year);

            option.textContent =
                String(year);

            if (year === currentYear) {

                option.selected = true;

            }

            yearSelect.appendChild(option);

        });

    }


    /* =====================================================
       REGION HELPERS
       ===================================================== */

    function normalizeRegion(region) {

        if (!region) {
            return "";
        }

        return region
            .trim()
            .toUpperCase();

    }


    function getRegionElement(region) {

        if (!svgDocument) {
            return null;
        }

        const normalized =
            normalizeRegion(region);

        const elements =
            svgDocument.querySelectorAll("[region]");

        for (const element of elements) {

            const elementRegion =
                normalizeRegion(
                    element.getAttribute("region")
                );

            if (elementRegion === normalized) {

                return element;

            }

        }

        return null;

    }


    function getRegionName(region) {

        const element =
            getRegionElement(region);

        if (!element) {

            return normalizeRegion(region);

        }

        return (
            element.getAttribute("long-name") ||
            normalizeRegion(region)
        );

    }


    function getRegionValue(region) {

        const normalized =
            normalizeRegion(region);

        return Number(
            currentElectoralVotes[normalized] || 0
        );

    }


    function getRegionShapes(region) {

        const element =
            getRegionElement(region);

        if (!element) {
            return [];
        }

        const tag =
            element.tagName.toLowerCase();

        if (
            tag === "path" ||
            tag === "polygon" ||
            tag === "rect"
        ) {

            return [element];

        }

        return Array.from(
            element.querySelectorAll(
                "path, polygon, rect"
            )
        );

    }


    function paintRegion(region, fill) {

        getRegionShapes(region)
            .forEach(function (shape) {

                shape.style.fill = fill;

            });

    }


    /* =====================================================
       ELECTORAL-VOTE TOTAL
       ===================================================== */

    function getTotalElectoralVotes() {

        return Object.values(
            currentElectoralVotes
        ).reduce(
            function (total, value) {

                return total + Number(value);

            },
            0
        );

    }


    function getMajorityNeeded() {

        const total =
            getTotalElectoralVotes();

        return Math.floor(total / 2) + 1;

    }


    /* =====================================================
       CHANGE ELECTION YEAR
       ===================================================== */

    function changeElectionYear(year) {

        const numericYear =
            Number(year);

        if (!PRESIDENTIAL_EV[numericYear]) {

            console.error(
                "ElectScope: unsupported presidential year:",
                numericYear
            );

            return;

        }

        currentYear =
            numericYear;

        currentElectoralVotes =
            PRESIDENTIAL_EV[currentYear];


        /* Update heading immediately */

        mapTitle.textContent =
            currentYear +
            " Presidential Map";


        /* Update majority */

        if (majorityNumber) {

            majorityNumber.textContent =
                getMajorityNeeded();

        }


        /* Clear ratings from previous year */

        clearAssignments();


        /* Update SVG numbers */

        updateElectoralVoteLabels();


        /* Recalculate totals */

        updateTotals();

    }


    /* =====================================================
       YEAR CHANGE EVENT
       ===================================================== */

    yearSelect.addEventListener(
        "change",
        function () {

            changeElectionYear(
                yearSelect.value
            );

        }
    );


    /* =====================================================
       UPDATE SVG EV LABELS
       ===================================================== */

    function updateElectoralVoteLabels() {

        if (!svgDocument) {
            return;
        }

        const labels =
            svgDocument.querySelectorAll(
                "[for-region]"
            );

        labels.forEach(function (label) {

            const region =
                normalizeRegion(
                    label.getAttribute(
                        "for-region"
                    )
                );

            const valueText =
                label.querySelector(
                    '[map-type="value-text"]'
                );

            if (!valueText) {
                return;
            }

            const value =
                getRegionValue(region);

            if (value > 0) {

                valueText.textContent =
                    value;

            }

        });

    }


    /* =====================================================
       MAP INTERACTION
       ===================================================== */

    function makeMapInteractive() {

        if (!svgDocument) {
            return;
        }

        const clickable =
            svgDocument.querySelectorAll(
                "[region], [for-region]"
            );

        clickable.forEach(function (element) {

            const rawRegion =
                element.getAttribute("region") ||
                element.getAttribute(
                    "for-region"
                );

            const region =
                normalizeRegion(rawRegion);

            if (
                !region ||
                !getRegionElement(region)
            ) {

                return;

            }

            element.style.cursor =
                "pointer";

            element.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    selectRegion(region);

                }
            );

        });

    }


    /* =====================================================
       SELECT REGION
       ===================================================== */

    function selectRegion(region) {

        selectedRegion =
            normalizeRegion(region);

        const name =
            getRegionName(selectedRegion);

        const value =
            getRegionValue(selectedRegion);


        if (selectedName) {

            selectedName.textContent =
                name;

        }


        if (selectedDescription) {

            selectedDescription.textContent =
                value +
                " electoral vote" +
                (value === 1 ? "" : "s");

        }


        if (selectedIcon) {

            selectedIcon.textContent =
                selectedRegion;

        }


        const existing =
            assignments[selectedRegion];


        partyButtons.forEach(
            function (button) {

                button.classList.toggle(
                    "active",
                    Boolean(
                        existing &&
                        button.dataset.party ===
                        existing.party
                    )
                );

            }
        );


        ratingButtons.forEach(
            function (button) {

                button.classList.toggle(
                    "active",
                    Boolean(
                        existing &&
                        button.dataset.rating ===
                        existing.rating
                    )
                );

            }
        );


        selectedParty =
            existing
                ? existing.party
                : null;

    }


    /* =====================================================
       ASSIGN REGION
       ===================================================== */

    function assignRegion(rating) {

        if (
            !selectedRegion ||
            !selectedParty
        ) {

            return;

        }

        assignments[selectedRegion] = {

            party: selectedParty,
            rating: rating

        };


        paintRegion(
            selectedRegion,
            colors[selectedParty][rating]
        );


        updateTotals();

        selectRegion(selectedRegion);

    }


    /* =====================================================
       UPDATE PARTY TOTALS
       ===================================================== */

    function updateTotals() {

        let democrat = 0;

        let republican = 0;


        Object.entries(assignments)
            .forEach(function (entry) {

                const region =
                    entry[0];

                const assignment =
                    entry[1];

                const value =
                    getRegionValue(region);


                if (
                    assignment.party ===
                    "democrat"
                ) {

                    democrat += value;

                }


                if (
                    assignment.party ===
                    "republican"
                ) {

                    republican += value;

                }

            });


        if (democratTotal) {

            democratTotal.textContent =
                democrat;

        }


        if (republicanTotal) {

            republicanTotal.textContent =
                republican;

        }

    }


    /* =====================================================
       CLEAR MAP
       ===================================================== */

    function clearAssignments() {

        Object.keys(assignments)
            .forEach(function (region) {

                paintRegion(
                    region,
                    neutralFill
                );

            });


        Object.keys(assignments)
            .forEach(function (region) {

                delete assignments[region];

            });


        selectedRegion = null;

        selectedParty = null;


        if (selectedName) {

            selectedName.textContent =
                "Select a state";

        }


        if (selectedDescription) {

            selectedDescription.textContent =
                "Click a state on the map";

        }


        if (selectedIcon) {

            selectedIcon.textContent =
                "--";

        }


        partyButtons.forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );

            }
        );


        ratingButtons.forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );

            }
        );


        updateTotals();

    }


    /* =====================================================
       PARTY BUTTONS
       ===================================================== */

    partyButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (!selectedRegion) {
                        return;
                    }


                    selectedParty =
                        button.dataset.party;


                    partyButtons.forEach(
                        function (item) {

                            item.classList.toggle(
                                "active",
                                item === button
                            );

                        }
                    );

                }
            );

        }
    );


    /* =====================================================
       RATING BUTTONS
       ===================================================== */

    ratingButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    assignRegion(
                        button.dataset.rating
                    );

                }
            );

        }
    );


    /* =====================================================
       MAP ACTIONS
       ===================================================== */

    const resetButton =
        document.querySelector(
            '[data-action="reset"]'
        );

    const clearButton =
        document.querySelector(
            '[data-action="clear"]'
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            clearAssignments
        );

    }


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearAssignments
        );

    }


    /* =====================================================
       SVG LOAD
       ===================================================== */

    mapObject.addEventListener(
        "load",
        function () {

            svgDocument =
                mapObject.contentDocument;

            if (!svgDocument) {

                console.error(
                    "ElectScope: presidential SVG could not be accessed."
                );

                return;

            }


            updateElectoralVoteLabels();

            makeMapInteractive();

            updateTotals();

        }
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    buildYearDropdown();

    changeElectionYear(2028);

});
