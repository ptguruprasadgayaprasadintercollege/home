// ====================
// LOGIN PROTECTION
// ====================

async function checkLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {

        window.location.replace(
            "admin-login.html"
        );

        return false;
    }

    console.log(
        "Logged In:",
        session.user.email
    );

    return true;
}

(async () => {

    const loggedIn =
        await checkLogin();

    if (!loggedIn) return;

    loadTeachers();
    loadAcademicFees();

})();

// Auto redirect after logout/session expiry

setTimeout(async () => {

    await supabaseClient.auth.signOut();

    alert("Session Expired");

    window.location.href =
        "admin-login.html";

}, 10 * 60 * 1000);


supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        if (!session) {

            window.location.href =
                "admin-login.html";
        }
    }
);


// window.location.href = "admin.html";


// Admin logout function 

async function logoutAdmin() {

    const { error } =
        await supabaseClient.auth.signOut();

    console.log(error);

    localStorage.clear();
    sessionStorage.clear();

    window.location.replace(
        "admin-login.html"
    );
}

// Change password function

async function changePassword() {

    const password =
        document.getElementById("newPassword").value;

    if (password.length < 6) {
        alert("Minimum 6 characters");
        return;
    }

    const { error } =
        await supabaseClient.auth.updateUser({
            password: password
        });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Password Updated");
    document.getElementById("newPassword").value = "";   
}

const passwordInput =
    document.getElementById("newPassword");

const togglePassword =
    document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if(passwordInput.type === "password"){

        passwordInput.type = "text";

        togglePassword.classList.remove("fa-eye");

        togglePassword.classList.add("fa-eye-slash");

    }else{

        passwordInput.type = "password";

        togglePassword.classList.remove("fa-eye-slash");

        togglePassword.classList.add("fa-eye");

    }

});


// Add teacher function

document
    .getElementById("teacherForm")
    .addEventListener("submit", async (e) => {

        console.log("BUTTON CLICKED");

        e.preventDefault();

        const name =
            document.getElementById("name").value;

        const subject =
            document.getElementById("subject").value;

        const file =
            document.getElementById("photo").files[0];

        const fileName =
            Date.now() + "-" + file.name;

        if (!file) {
            alert("Please select a photo");
            return;
        }

        const { error: uploadError } =
            await supabaseClient.storage
                .from("teacher-images")
                .upload(fileName, file);

        if (uploadError) {
            alert(uploadError.message);
            return;
        }

        const { data: urlData } =
            supabaseClient.storage
                .from("teacher-images")
                .getPublicUrl(fileName);

        const imageUrl =
            urlData.publicUrl;

        const { error } =
            await supabaseClient
                .from("teachers")
                .insert([
                    {
                        name,
                        subject,
                        photo_url: imageUrl
                    }
                ]);

        const form = document.getElementById("teacherForm");

        if (error) {
            alert(error.message);
        } else {
            alert("Teacher Added");
            form.reset();
            loadTeachers();
        }
    });


// Delete funtion for techers list
async function deleteTeacher(id) {

    if (!confirm("Delete Teacher?")) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("teachers")
            .delete()
            .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    loadTeachers();
}

// Edit funtion for techers list

async function editTeacher(id) {

    const newName =
        prompt("Enter New Name");

    const newSubject =
        prompt("Enter New Subject");

    if (!newName || !newSubject) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("teachers")
            .update({
                name: newName,
                subject: newSubject
            })
            .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    loadTeachers();
}

// Fuction to load teachers list
async function loadTeachers() {

    console.log("USER =", await supabaseClient.auth.getUser());
    console.log("LOAD TEACHERS RUNNING");

    const { data, error } =
        await supabaseClient
            .from("teachers")
            .select("*");

    console.log(data);
    console.log(error);


    const container =
        document.getElementById("teachers-list");

    container.innerHTML = "";

    console.log("CONTAINER =", container);

    data.forEach(teacher => {

        container.innerHTML += `
        <div class="teacher-card">

            <img src="${teacher.photo_url}"
            width="100">

            <div class="teacher-info">
                <h3>${teacher.name}</h3>
                <p>${teacher.subject}</p>    
            </div>

            <div class="teacher-actions">
                <button
                onclick="editTeacher(${teacher.id})">
                Edit
                </button>

                <button
                onclick="deleteTeacher(${teacher.id})">
                Delete
                </button>
            </div>

        </div>
        `;
    });
}

// Fee structure form submission

async function loadAcademicFees() {

    const { data, error } =
        await supabaseClient
            .from("academic_fees")
            .select("*")
            .order("id");

    if (error) {
        console.log(error);
        return;
    }

    const container =
        document.getElementById(
            "feeTableAdmin"
        );
    console.log("DATA =", data);
    container.innerHTML = `


    <table class="fee-table">

    <thead>

    <tr>

    <th>CLASS</th>

    <th>
    April
    <br>
    (Development Fee + Academic Fee)
    </th>

    <th>Total</th>

    <th>May</th>
    <th>June</th>
    <th>July</th>
    <th>Aug</th>
    <th>Sept</th>
    <th>Oct</th>
    <th>Nov</th>
    <th>Dec</th>
    <th>Jan</th>
    <th>Feb</th>
    <th>March</th>
    <th>Action</th>

    </tr>

    </thead>

    <tbody  id="feeBody">

    </tbody>

    </table>
    `;

    const body =
        document.getElementById(
            "feeBody"
        );

    data.forEach(fee => {

        if (fee.class_name === "Nursery") {

            body.innerHTML += `
        <tr>
            <td colspan="15">
            FEE Structure Nursery TO CLASS-5
            </td>
            </tr>
            `;
        }

        if (fee.class_name === "Class 6") {

            body.innerHTML += `
        <tr>
        <td colspan="15">
        FEE Structure CLASS-6 TO CLASS-12
        </td>
        </tr>
        `;
        }

        body.innerHTML += `
        <table class="fee-table">
        
        <td>${fee.class_name}</td>
        
        <td><input id="april-${fee.id}" value="${fee.april || ""}"></td>
        <td><input id="total-${fee.id}" value="${fee.total || ""}"></td>
        <td><input id="may-${fee.id}" value="${fee.may || ""}"></td>
        <td><input id="june-${fee.id}" value="${fee.june || ""}"></td>
        <td><input id="july-${fee.id}" value="${fee.july || ""}"></td>
        <td><input id="august-${fee.id}" value="${fee.august || ""}"></td>
        <td><input id="september-${fee.id}" value="${fee.september || ""}"></td>
        <td><input id="october-${fee.id}" value="${fee.october || ""}"></td>
        <td><input id="november-${fee.id}" value="${fee.november || ""}"></td>
        <td><input id="december-${fee.id}" value="${fee.december || ""}"></td>
        <td><input id="january-${fee.id}" value="${fee.january || ""}"></td>
        <td><input id="february-${fee.id}" value="${fee.february || ""}"></td>
        <td><input id="march-${fee.id}" value="${fee.march || ""}"></td>

        <td>

        <button
        onclick="saveFeeRow(${fee.id})">
        Save
        </button>

        </td>

        </tr>
  </table>
        `;
    });

}

// Save button function for fee structure

async function saveFeeRow(id) {

    const { error } =
        await supabaseClient
            .from("academic_fees")
            .update({

                april:
                    document.getElementById(`april-${id}`).value,

                total:
                    document.getElementById(`total-${id}`).value,

                may:
                    document.getElementById(`may-${id}`).value,

                june:
                    document.getElementById(`june-${id}`).value,

                july:
                    document.getElementById(`july-${id}`).value,

                august:
                    document.getElementById(`august-${id}`).value,

                september:
                    document.getElementById(`september-${id}`).value,

                october:
                    document.getElementById(`october-${id}`).value,

                november:
                    document.getElementById(`november-${id}`).value,

                december:
                    document.getElementById(`december-${id}`).value,

                january:
                    document.getElementById(`january-${id}`).value,

                february:
                    document.getElementById(`february-${id}`).value,

                march:
                    document.getElementById(`march-${id}`).value

            })
            .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Fee Updated");
}
