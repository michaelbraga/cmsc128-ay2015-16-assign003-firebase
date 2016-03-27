var notesdb = new Firebase('https://notepadalpha.firebaseio.com/notes');


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

	notesdb.push({title: title, note: note, completed:completed});
	$('#titleInput').val('');
	$('#noteInput').val('');
	event.preventDefault();
});









notesdb.on('child_added', function(snapshot) {
	var note = snapshot.val();
	displayNote(note.title, note.note, note.completed);
});

function displayNote(title, note, completed) {
	var idTag;
	if (completed == "0" || completed == 0)
		idTag = "#notCompletedList";
	else if(completed == "1" || completed == 1)
		idTag = "#completedList";
	else
		return;

	$(idTag).append("<tr> <td>"+title+"</td> <td>"+note+"</td> </tr>");
};
