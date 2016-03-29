/* FIREBASE */
var root = new Firebase('https://notepadalpha.firebaseio.com/');
/* notesdb for the list of NOTES */
var notesdb = root.child('notes');

/**************************** FUNCTION DEFINITIONS ****************************/
// delete a note
function deleteNote(noteId) {
	if (confirm('Are you sure?')) {
		// get branch of the specific note
		var toDelete = notesdb.child(noteId);
		// remove
		toDelete.remove();
	}
}

// edit a note
function editNote(noteId) {
	// initialize modal to have the old information in the form
	$('#titleEdit').val($('#title'+noteId).text());
	$('#noteEdit').val($('#note'+noteId).text());
	// show modal
	$("#editModal").modal('show');

	// function to handle when submit button is clicked
	$('#editForm').submit(function (event) {
		// get the branch of thespecific note
		var toUpdate = notesdb.child(noteId);
		// update things
		toUpdate.update({title:$('#titleEdit').val(), note:$('#noteEdit').val()},
			// function to handle synchronization errors
			function (error) {
				if (error) {
					alert("Something went wrong!")
				}
			});
		// delay submit to avoid redirection
		event.preventDefault();
		// hide modal
		$("#editModal").modal('hide');
	});
}

// toggle a note (switching a note from being 'complete' to 'not yet complete' and vice-versa)
function toggle(noteId) {
	if (confirm('Are you sure?')) {
		// get all details from the note
		var tM = {
			title:$("#title"+noteId).text(),
			note:$("#note"+noteId).text(),
			// switch its status
			completed: ((($("#completed"+noteId).attr("value")) == 0)? 1:0)
		};
		// add the new one to FirebaseDB
		notesdb.push(tM);
		// remove the old one
		notesdb.child(noteId).remove();
	}

}

// show the lists of 'complete' xor 'not yet complete' notes
function show(list) {

	// show complete Panel
	if (list == 1) {
		$("#incompletePanel").hide();
		$("#completeButton").attr("class", "btn btn-primary btn-lg disabled");
		$("#completePanel").show();
		$("#incompleteButton").attr("class", "btn btn-primary btn-lg");
	}
	// show incomplete Panel
	else if(list == 0){
		$("#completePanel").hide();
		$("#incompleteButton").attr("class", "btn btn-primary btn-lg disabled");
		$("#incompletePanel").show();
		$("#completeButton").attr("class", "btn btn-primary btn-lg");
	}
}

// function that displays a note to its specific panel/lists
function displayNote(noteid, title, note, completed) {
	var idTag, htmlTag;
	if (completed == "0" || completed == 0){
		idTag = "#notCompletedList";
		htmlTag = "<button class='btn btn-info btn-xs' onclick='toggle(\""+noteid+"\")'>Mark as Complete</button>";
	}else if(completed == "1" || completed == 1){
		idTag = "#completedList";
		htmlTag = "<button class='btn btn-info btn-xs' onclick='toggle(\""+noteid+"\")'>Mark as Not Complete</button>";
	}else
		return;

	$(idTag).append(
		"<tr id='"+noteid+"'>"+
			"<td id='title"+noteid+"'>"+title+"</td>"+
			"<td id='note"+noteid+"'>"+note+"</td>"+
			"<td id='completed"+noteid+"' value='"+completed+"' style='text-align:center;'>"+
			htmlTag +
			" <button class='btn btn-default btn-xs' onclick='editNote(\""+noteid+"\")'><span title='Edit' class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>"+
			" <button  class='btn btn-danger btn-xs' onclick='deleteNote(\""+noteid+"\")'><span title='Remove' class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></td>"+
		"</tr>");
};

/*********************************** JQUERY ***********************************/
$('document').ready(function () {

	// show the complete Panel on default
	show(1);

	// Function to handle adding a note
	$('#addNoteForm').submit(function (event) {
		// get the values and check if empty
		var title = $('#titleInput').val();
		if (title === "" || !title) {
			alert('No title!');
			return;
		}
		var note = $('#noteInput').val();
		if (note === "" || !note) {
			alert('No note!');
			return;
		}
		var completed = $('#completedInput').val();
		// push the information to Firebase
		notesdb.push({
			title: title,
			note: note,
			completed:completed
		});
		// clear form
		$('#titleInput').val('');
		$('#noteInput').val('');
		alert("Note successfully added!");
		// delay submit to avoid redirection
		event.preventDefault();
	});

	// function to handle every addition of note in firebase
	notesdb.on('child_added', function(snapshot) {
		var note = snapshot.val();
		// display in the Panel of notes
		displayNote(snapshot.ref().key(), note.title, note.note, note.completed);
	});

	// function to handle every change/update of note in firebase
	notesdb.on('child_changed', function(snapshot) {
		alert("Editing was successful!");
		var noteid = snapshot.ref().key();
		$("#"+noteid).replaceWith("<tr id='"+noteid+"'>"+
			"<td id='title"+noteid+"'>"+snapshot.val().title+"</td>"+
			"<td id='note"+noteid+"'>"+snapshot.val().note+"</td>"+
			"<td id='completed"+noteid+"' value='"+snapshot.val().completed+"' style='text-align:center;'>"+
			((snapshot.val().completed == 0)? "<button class='btn btn-info btn-xs' onclick='toggle(\""+noteid+"\")'>Mark as Complete</button>":"<button class='btn btn-info btn-xs' onclick='toggle(\""+noteid+"\")'>Mark as Not Complete</button>") +
			" <button class='btn btn-default btn-xs' onclick='editNote(\""+noteid+"\")'><span title='Edit' class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>"+
			" <button  class='btn btn-danger btn-xs' onclick='deleteNote(\""+noteid+"\")'><span title='Remove' class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></td>"+
			"</tr>");
	});

	// function to handle every removal of note in firebase
	notesdb.on('child_removed', function(snapshot) {
		$("#"+snapshot.ref().key()).remove();
	});
});
