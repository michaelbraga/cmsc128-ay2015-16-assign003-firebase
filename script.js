var root = new Firebase('https://notepadalpha.firebaseio.com/');
var notesdb = root.child('notes');

// Delete a note
function deleteNote(noteId) {
	if (confirm('Are you sure?')) {
		var toDelete = notesdb.child(noteId);
		toDelete.remove();
	}
}

// Edit a note
function editNote(noteId) {

	if (confirm('Are you sure?')) {
		$('#titleEdit').val($('#title'+noteId).text());
		$('#noteEdit').val($('#note'+noteId).text());
		$("#editModal").modal('show');

		$('#editForm').submit(function (event) {
			var toUpdate = notesdb.child(noteId);
			toUpdate.update({title:$('#titleEdit').val(), note:$('#noteEdit').val()}, function (error) {
				if (error) {
					alert("Something went wrong!")
				}
			});
			event.preventDefault();
			$("#editModal").modal('hide');
		});
	}
}

// toggle a note
function toggle(noteId) {
	if (confirm('Are you sure?')) {
		var tM = {
			title:$("#title"+noteId).text(),
			note:$("#note"+noteId).text(),
			completed: ((($("#completed"+noteId).attr("value")) == 0)? 1:0)
		};
		notesdb.push(tM);
		notesdb.child(noteId).remove();
	}

}

function show(list) {
	if (list == 1) {
		$("#incompletePanel").hide();
		$("#completeButton").attr("class", "btn btn-primary btn-lg disabled");
		$("#completePanel").show();
		$("#incompleteButton").attr("class", "btn btn-primary btn-lg");
	}
	else if(list == 0){
		$("#completePanel").hide();
		$("#incompleteButton").attr("class", "btn btn-primary btn-lg disabled");
		$("#incompletePanel").show();
		$("#completeButton").attr("class", "btn btn-primary btn-lg");
	}
}

$('document').ready(function () {

	show(1);
	// Add a note
	$('#addNoteForm').submit(function (event) {
		var title = $('#titleInput').val();
		if (title === "" || !title) {
			alert('No title!');
		}
		var note = $('#noteInput').val();
		if (note === "" || !note) {
			alert('No note!');
		}
		var completed = $('#completedInput').val();

		notesdb.push({
			title: title,
			note: note,
			completed:completed
		});
		$('#titleInput').val('');
		$('#noteInput').val('');
		alert("Note successfully added!");
		event.preventDefault();
	});



	notesdb.on('child_added', function(snapshot) {
		var note = snapshot.val();
		displayNote(snapshot.ref().key(), note.title, note.note, note.completed);
	});

	notesdb.on('child_changed', function(snapshot) {
		alert("Editing was successful!");
		var noteid = snapshot.ref().key();
		$("#"+noteid).replaceWith("<tr id='"+noteid+"'>"+
			"<td id='title"+noteid+"'>"+snapshot.val().title+"</td>"+
			"<td id='note"+noteid+"'>"+snapshot.val().note+"</td>"+
			"<td id='completed"+noteid+"' value='"+snapshot.val().completed+"' style='text-align:center;'>"+
			((snapshot.val().completed == 0)? "<button class='btn btn-info btn-xs' onclick='toggle(\""+noteid+"\")'>Mark as Complete</button>":"<button class='btn btn-info btn-xs'>Mark as Not Complete</button>") +
			" <button class='btn btn-default btn-xs' onclick='editNote(\""+noteid+"\")'><span title='Edit' class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>"+
			" <button  class='btn btn-danger btn-xs' onclick='deleteNote(\""+noteid+"\")'><span title='Remove' class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></td>"+
			"</tr>");
	});

	notesdb.on('child_removed', function(snapshot) {
		$("#"+snapshot.ref().key()).remove();
	});

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
});
