/* =========================================================
   ElectScope Maps
   Presidential map engine
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PAGE ELEMENTS
       ===================================================== */

    const mapObject =
        document.getElementById("election-map");

    const yearSelect =
        document.getElementById("election-year");

    const mapTitle =
        document.getElementById("map-title");

    const selectedName =
        document.getElementById("selected-state-name");

    const selectedDescription =
        document.getElementById("selected-state-description");

    const selectedIcon =
        document.getElementById("selected-state-icon");

    const democratTotal =
        document.getElementById("democrat-total");

    const republicanTotal =
        document.getElementById("republican-total");

    const majorityNumber =
        document.querySelector(".summary-majority strong");

    const partyButtons =
        document.querySelectorAll("[data-party]");

    const ratingButtons =
        document.querySelectorAll("[data-rating]");

    if (!mapObject || !yearSelect) {
        return;
    }


    /* =====================================================
       MAP STATE
       ===================================================== */

    let svgDocument = null;

    let selectedRegion = null;

    let selectedParty = null;

    let currentYear =
        Number(yearSelect.value);

    let currentElectionData = null;

    let currentElectoralVotes = {};

    let currentMajority = 270;

    const assignments = {};


    /* =====================================================
       ELECTSCOPE COLORS
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

        const allRegions =
            svgDocument.querySelectorAll("[region]");

        for (const element of allRegions) {

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
            .forEach(shape => {

                shape.style.fill = fill;

            });

    }


    /* =====================================================
       YEAR + ELECTION DATA
       ===================================================== */

    function loadElectionYear(year) {

        currentYear =
            Number(year);

        currentElectionData =
            getPresidentialElectionData(
                currentYear
            );

        if (!currentElectionData) {

            console.warn(
                `No presidential election data for ${currentYear}.`
            );

            return false;

        }

        currentElectoralVotes = {
            ...currentElectionData.electoralVotes
        };

        currentMajority =
            calculateElectoralMajority(
                currentElectionData
                    .totalElectoralVotes
            );

        updateYearInterface();

        return true;

    }


    function updateYearInterface() {

        if (mapTitle) {

            mapTitle.textContent =
                `${currentYear} Presidential Map`;

        }

        if (majorityNumber) {

            majorityNumber.textContent =
                currentMajority;

        }

        updateElectoralVoteLabels();

    }


    /* =====================================================
       ELECTORAL VOTE LABELS
       ===================================================== */

    function updateElectoralVoteLabels() {

        if (!svgDocument) {
            return;
        }

        svgDocument
            .querySelectorAll("[for-region]")
            .forEach(label => {

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

        clickable.forEach(element => {

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
                event => {

                    event.stopPropagation();

                    selectRegion(region);

                }
            );

        });

    }


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
                `${value} electoral vote${
                    value === 1 ? "" : "s"
                }`;

        }

        if (selectedIcon) {

            selectedIcon.textContent =
                selectedRegion;

        }

        const existing =
            assignments[selectedRegion];

        partyButtons.forEach(button => {

            button.classList.toggle(
                "active",
                Boolean(
                    existing &&
                    button.dataset.party ===
                    existing.party
                )
            );

        });

        ratingButtons.forEach(button => {

            button.classList.toggle(
                "active",
                Boolean(
                    existing &&
                    button.dataset.rating ===
                    existing.rating
                )
            );

        });

        selectedParty =
            existing
                ? existing.party
                : null;

    }


    /* =====================================================
       PARTY + RATING ASSIGNMENTS
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
       ELECTORAL VOTE TOTALS
       ===================================================== */

    function updateTotals() {

        let democrat = 0;

        let republican = 0;

        Object.entries(assignments)
            .forEach(
                ([region, assignment]) => {

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

                }
            );

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
       CLEAR CURRENT MAP
       ===================================================== */

    function clearAssignments() {

        Object.keys(assignments)
            .forEach(region => {

                paintRegion(
                    region,
                    neutralFill
                );

            });

        Object.keys(assignments)
            .forEach(region => {

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

        partyButtons.forEach(button => {

            button.classList.remove(
                "active"
            );

        });

        ratingButtons.forEach(button => {

            button.classList.remove(
                "active"
            );

        });

        updateTotals();

    }


    /* =====================================================
       YEAR DROPDOWN
       ===================================================== */

    yearSelect.addEventListener(
        "change",
        () => {

            const requestedYear =
                Number(yearSelect.value);

            const election =
                getPresidentialElectionData(
                    requestedYear
                );

            if (!election) {

                /*
                 Midterm years such as 2026 do not
                 have a regular presidential election.
                 For now, return to the previous
                 presidential year instead of loading
                 fake presidential data.
                */

                yearSelect.value =
                    String(currentYear);

                return;

            }

            clearAssignments();

            loadElectionYear(
                requestedYear
            );

            updateElectoralVoteLabels();

        }
    );


    /* =====================================================
       PARTY BUTTONS
       ===================================================== */

    partyButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (!selectedRegion) {
                    return;
                }

                selectedParty =
                    button.dataset.party;

                partyButtons.forEach(item => {

                    item.classList.toggle(
                        "active",
                        item === button
                    );

                });

            }
        );

    });


    /* =====================================================
       RATING BUTTONS
       ===================================================== */

    ratingButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                assignRegion(
                    button.dataset.rating
                );

            }
        );

    });


    /* =====================================================
       MAP ACTION BUTTONS
       ===================================================== */

    const actionButtons =
        document.querySelectorAll(
            ".map-action-button"
        );

    actionButtons.forEach(button => {

        const action =
            button.textContent
                .trim()
                .toLowerCase();

        if (
            action === "reset" ||
            action === "clear"
        ) {

            button.addEventListener(
                "click",
                clearAssignments
            );

        }

    });


    /* =====================================================
       SVG LOAD
       ===================================================== */

    mapObject.addEventListener(
        "load",
        () => {

            svgDocument =
                mapObject.contentDocument;

            if (!svgDocument) {
                return;
            }

            loadElectionYear(
                currentYear
            );

            makeMapInteractive();

            updateElectoralVoteLabels();

            updateTotals();

        }
    );

});
