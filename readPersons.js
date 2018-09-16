
print("Creating persons collection...");


// much slower method that works
var creditsCursor = db.credits.find( { "id":"862" } );
creditsCursor.forEach( function (currentCredit) {
	var i;
	for (i = 0; i < currentCredit.cast.length; i++) {
		print(currentCredit.cast[i].name);
	}
	//db.persons.updateOne(
	//	{ },
	//	{ },
	//	{ upsert: 1 }
	//);
});
creditsCursor.close();

print("Done creating persons collection.");