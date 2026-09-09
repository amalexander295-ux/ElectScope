/* =========================================================
   ElectScope Maps
   Presidential map interaction
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const mapObject = document.getElementById("election-map");
    if (!mapObject) return;

    const selectedName = document.getElementById("selected-state-name");
    const selectedDescription = document.getElementById("selected-state-description");
    const selectedIcon = document.getElementById("selected-state-icon");
    const democratTotal = document.getElementById("democrat-total");
    const republicanTotal = document.getElementById("republican-total");

    const partyButtons = document.querySelectorAll("[data-party]");
    const ratingButtons = document.querySelectorAll("[data-rating]");

    let svgDocument = null;
    let selectedRegion = null;
    let selectedParty = null;

    const assignments = {};

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

    function getRegionElement(region) {
        return svgDocument.querySelector(`[region="${region}"]`);
    }

    function getRegionValue(region) {
        const element = getRegionElement(region);

        return element
            ? Number(element.getAttribute("value") || 0)
            : 0;
    }

    function getRegionName(region) {
        const element = getRegionElement(region);

        return element
            ? element.getAttribute("long-name") || region.toUpperCase()
            : region.toUpperCase();
    }

    function getRegionShapes(region) {
        const element = getRegionElement(region);

        if (!element) {
            return [];
        }

        if (element.tagName.toLowerCase() === "path") {
            return [element];
        }

        return Array.from(
            element.querySelectorAll("path, polygon, rect")
        );
    }

    function paintRegion(region, fill) {
        getRegionShapes(region).forEach(shape => {
            shape.style.fill = fill;
        });
    }

    function updateElectoralVoteLabels() {
        svgDocument
            .querySelectorAll("[for-region]")
            .forEach(label => {
                const region = label.getAttribute("for-region");

                const valueText =
                    label.querySelector('[map-type="value-text"]');

                if (!valueText) {
                    return;
                }

                const value = getRegionValue(region);

                if (value) {
                    valueText.textContent = value;
                }
            });
    }

    function makeMapInteractive() {
        const clickable =
            svgDocument.querySelectorAll(
                "[region], [for-region]"
            );

        clickable.forEach(element => {
            const region =
                element.getAttribute("region") ||
                element.getAttribute("for-region");

            if (!region || !getRegionElement(region)) {
                return;
            }

            element.style.cursor = "pointer";

            element.addEventListener("click", event => {
                event.stopPropagation();
                selectRegion(region);
            });
        });
    }

    function selectRegion(region) {
        selectedRegion = region;

        const name = getRegionName(region);
        const value = getRegionValue(region);

        selectedName.textContent = name;

        selectedDescription.textContent =
            `${value} electoral vote${value === 1 ? "" : "s"}`;

        selectedIcon.textContent =
            region.toUpperCase();

        const existing = assignments[region];

        partyButtons.forEach(button => {
            button.classList.toggle(
                "active",
                existing &&
                button.dataset.party === existing.party
            );
        });

        ratingButtons.forEach(button => {
            button.classList.toggle(
                "active",
                existing &&
                button.dataset.rating === existing.rating
            );
        });

        selectedParty =
            existing ? existing.party : null;
    }

    function assignRegion(rating) {
        if (!selectedRegion || !selectedParty) {
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

    function updateTotals() {
        let dem = 0;
        let gop = 0;

        Object.entries(assignments).forEach(
            ([region, assignment]) => {

                const value =
                    getRegionValue(region);

                if (assignment.party === "democrat") {
                    dem += value;
                }

                if (assignment.party === "republican") {
                    gop += value;
                }
            }
        );

        democratTotal.textContent = dem;
        republicanTotal.textContent = gop;
    }

    function resetMap() {
        Object.keys(assignments).forEach(region => {
            paintRegion(region, neutralFill);
        });

        Object.keys(assignments).forEach(region => {
            delete assignments[region];
        });

        selectedRegion = null;
        selectedParty = null;

        selectedName.textContent =
            "Select a state";

        selectedDescription.textContent =
            "Click a state on the map";

        selectedIcon.textContent = "--";

        partyButtons.forEach(button => {
            button.classList.remove("active");
        });

        ratingButtons.forEach(button => {
            button.classList.remove("active");
        });

        updateTotals();
    }

    partyButtons.forEach(button => {
        button.addEventListener("click", () => {
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
        });
    });

    ratingButtons.forEach(button => {
        button.addEventListener("click", () => {
            assignRegion(
                button.dataset.rating
            );
        });
    });

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
                resetMap
            );
        }
    });

    mapObject.addEventListener("load", () => {
        svgDocument =
            mapObject.contentDocument;

        if (!svgDocument) {
            return;
        }

        updateElectoralVoteLabels();
        makeMapInteractive();
        updateTotals();
    });
});
