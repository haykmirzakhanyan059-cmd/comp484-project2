/*
    My Giga Pet

    Required features:
    - Store the pet's information in an object.
    - Change stats through Treat, Play, and Exercise.
    - Prevent negative stats.
    - Add a new action: Sleep.
    - Display a pet comment after every button press.

    Additional features:
    - Energy affects whether the pet can play or exercise.
    - Arrays provide different comments for each action.
    - Optional activity history shows newest entries first.

    Selected jQuery methods:
    1. .is()         https://api.jquery.com/is/
    2. .prependTo()  https://api.jquery.com/prependTo/
*/


// Store numbers as numbers, not strings, so arithmetic works correctly.
var pet_info = {
    name: "Mochi",
    weight: 20,
    happiness: 50,
    energy: 50
};


// Each property contains an array of possible comments for that action.
var pet_comments = {
    treat: [
        "Another treat? Yes, please!",
        "That was delicious!",
        "You know the way to my heart."
    ],

    play: [
        "That was fun! Again?",
        "You throw it, I will catch it!",
        "Playing with you is my favorite."
    ],

    exercise: [
        "My paws need a break!",
        "That was a long walk!",
        "I did my exercise. Is it nap time?"
    ],

    sleep: [
        "That nap was amazing!",
        "I dreamed about a mountain of treats.",
        "I feel rested and ready!"
    ]
};


// Wait until the HTML is ready before selecting elements or adding events.
$(function () {
    // Display the starting values from pet_info.
    checkAndUpdatePetInfoInHtml();

    /*
        Pass the function names without parentheses.

        This registers the functions to run later when a button is clicked.
        Adding parentheses here would immediately call the functions.
    */
    $(".treat-button").click(clickedTreatButton);
    $(".play-button").click(clickedPlayButton);
    $(".exercise-button").click(clickedExerciseButton);
    $(".sleep-button").click(clickedSleepButton);
});


function clickedTreatButton() {
    // Treats increase happiness and weight as required.
    pet_info.happiness += 5;
    pet_info.weight += 1;
    pet_info.energy += 5;

    finishAction("Treat", getRandomComment("treat"));
}


function clickedPlayButton() {
    /*
        Do not start an activity if the pet lacks enough energy.
        Still display a message because every button press needs feedback.
    */
    if (pet_info.energy < 10) {
        showPetMessage(
            "Play",
            "I am too sleepy to play. Let me sleep first!"
        );

        // Exit this function so the stats below do not change.
        return;
    }

    // Playing increases happiness and reduces weight.
    pet_info.happiness += 10;
    pet_info.weight -= 1;
    pet_info.energy -= 10;

    finishAction("Play", getRandomComment("play"));
}


function clickedExerciseButton() {
    if (pet_info.energy < 15) {
        showPetMessage(
            "Exercise",
            "I need a nap before another walk!"
        );

        return;
    }

    // Exercise reduces happiness and weight, following the assignment.
    pet_info.happiness -= 5;
    pet_info.weight -= 2;
    pet_info.energy -= 15;

    finishAction("Exercise", getRandomComment("exercise"));
}


function clickedSleepButton() {
    /*
        Sleep is our new action.
        It restores energy and adds happiness without changing weight.
    */
    pet_info.energy += 25;
    pet_info.happiness += 5;

    finishAction("Sleep", getRandomComment("sleep"));
}


function getRandomComment(action) {
    // Select the comment array associated with this action.
    var comments = pet_comments[action];

    /*
        Math.random() produces a number from 0 up to, but not including, 1.
        Multiplying by the array length gives a position within its range.
        Math.floor() rounds down to a valid whole-number array index.
    */
    var randomIndex = Math.floor(Math.random() * comments.length);

    return comments[randomIndex];
}


function finishAction(action, message) {
    /*
        All successful actions need these same steps.
        Keeping them in one function avoids repeating the code.
    */
    checkAndUpdatePetInfoInHtml();
    showPetMessage(action, message);
}


function checkAndUpdatePetInfoInHtml() {
    // Correct invalid values before displaying them.
    checkWeightAndHappinessBeforeUpdating();
    updatePetInfoInHtml();
}


function checkWeightAndHappinessBeforeUpdating() {
    // Prevent weight and happiness from becoming negative.
    if (pet_info.weight < 5) {
        pet_info.weight = 5;
    }

    if (pet_info.happiness < 0) {
        pet_info.happiness = 0;
    }

    // Energy is also a stat, so it needs the same lower boundary.
    if (pet_info.energy < 0) {
        pet_info.energy = 0;
    }

    // Happiness and energy use a 0–100 scale.
    if (pet_info.happiness > 100) {
        pet_info.happiness = 100;
    }

    if (pet_info.energy > 100) {
        pet_info.energy = 100;
    }
}


function updatePetInfoInHtml() {
    /*
        .text() replaces the text inside each matching HTML element.
        This method was already included in the starter code.
    */
    $(".name").text(pet_info.name);
    $(".weight").text(pet_info.weight);
    $(".happiness").text(pet_info.happiness);
    $(".energy").text(pet_info.energy);
}


function showPetMessage(action, message) {
    // Always update the speech bubble, even when history is turned off.
    $(".pet-message").text(message);

    /*
        UNIQUE METHOD 1: .is()
        Documentation: https://api.jquery.com/is/

        .is() checks whether a selected element matches a condition
        and returns a Boolean: true or false.

        Here, $("#keep-history") selects our checkbox.
        ":checked" checks whether that checkbox is currently selected.

        If it returns true, we add an activity entry.
        If it returns false, we only update the speech bubble.
    */
    if ($("#keep-history").is(":checked")) {
        // Create a new list item without inserting it into the page yet.
        var historyEntry = $("<li></li>");

        /*
            Set the entry's content as plain text.
            Example: "Treat: That was delicious!"
        */
        historyEntry.text(action + ": " + message);

        /*
            UNIQUE METHOD 2: .prependTo()
            Documentation: https://api.jquery.com/prependTo/

            .prependTo() inserts an element at the beginning of a target.

            Here, historyEntry is the new <li>.
            ".activity-history" selects the <ul> receiving that item.

            Inserting at the beginning keeps the newest activity above
            older activities.

            Syntax:
                content.prependTo(destination);
        */
        historyEntry.prependTo(".activity-history");
    }
}