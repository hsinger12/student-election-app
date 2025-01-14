// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwCbqEa067I5BvS6mX_ZjiQw4EVfpzhQ0",
    authDomain: "crescent-votes.firebaseapp.com",
    databaseURL: "https://crescent-votes-default-rtdb.firebaseio.com",
    projectId: "crescent-votes",
    storageBucket: "crescent-votes.firebasestorage.app",
    messagingSenderId: "774613067995",
    appId: "1:774613067995:web:83cbfee53e2cb5bbbc44fe",
    measurementId: "G-ZDSLRR64R4"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let selectedCandidate = null;

const candidates = [
    "Jackson Rosenhek", "Dario Danieli", "Owen Kotler", "Charlie Curry", "Iliyan Gangani",
    "Shaunik Mahajan", "Thomas Vesey", "Raheem Ebrahim", "Roan McReynolds", "Benjamin Sheng",
    "Robbie Muranaka", "Jackson Ding", "Abdul Hussein"
];

function displayCandidates() {
    const candidatesDiv = document.getElementById("candidates");
    candidatesDiv.innerHTML = ""; // Clear existing content
    candidates.forEach(candidate => {
        const candidateDiv = document.createElement("div");
        candidateDiv.className = "candidate";
        candidateDiv.innerText = candidate;
        candidateDiv.onclick = () => selectCandidate(candidate);
        candidatesDiv.appendChild(candidateDiv);
    });
}

displayCandidates();

function login() {
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = "defaultPassword"; // Default password for all users

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("Login successful!");
            showVotingSection();
        })
        .catch(error => {
            if (error.code === "auth/user-not-found") {
                auth.createUserWithEmailAndPassword(email, password)
                    .then(() => alert("Account created and logged in!"))
                    .then(() => showVotingSection());
            } else {
                alert("Error: " + error.message);
            }
        });
}

function showVotingSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('voting-section').style.display = 'block';
}

function selectCandidate(candidate) {
    if (selectedCandidate) {
        document.querySelector('.selected').classList.remove('selected');
    }
    selectedCandidate = candidate;
    event.target.classList.add('selected');
}

function submitVote() {
    if (!selectedCandidate) {
        alert("Please select a candidate before submitting.");
        return;
    }

    const user = auth.currentUser;
    const email = user.email;

    db.ref('votes/' + user.uid).once('value', snapshot => {
        if (snapshot.exists()) {
            alert('You have already voted!');
            return;
        }

        const voteWeight = isGrade11OrStaff(email) ? 2 : 1;

        db.ref('votes/' + user.uid).set({
            email: email,
            candidate: selectedCandidate,
            weight: voteWeight
        }).then(() => {
            alert('Thank you for voting!');
            logout();
        });
    });
}

function isGrade11OrStaff(email) {
    return email.includes("grade11") || email.includes("staff");
}

function logout() {
    auth.signOut().then(() => {
        alert("You have been logged out.");
        document.getElementById('voting-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
    });
}
