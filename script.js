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
	$('#notesDiv').append('<li><strong>'+title+'</strong>: '+note+' ('+((completed==0)?"Not yet completed":"Completed")+')'+'</li>');
};
