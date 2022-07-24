const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

//////////////////////////////////////////////////////////////////

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//////////////////////////////////////////////////////////////////

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = mongoose.Schema({
	title: String,
	content: String,
});

const Article = mongoose.model('Article', articleSchema);

//////////////////////////////////////////////////////////////////

app.route('/articles')
	.get((req, res) => {
		Article.find((err, found) => {
			res.send(err || found);
		});
	})
	.post((req, res) => {
		const { title, content } = req.body;

		new Article({ title, content }).save((err) => {
			res.send(err || `Created new article: ${title} with the content ${content}.`);
		});
	})
	.delete((req, res) => {
		Article.deleteMany({}, (err) => {
			res.send(err || 'Successfully deleted all articles.');
		});
	});

//////////////////////////////////////////////////////////////////

app.route('/articles/:articleTitle')
	.get((req, res) => {
		Article.findOne({ title: req.params.articleTitle }, (err, found) => {
			res.send(err || found);
		});
	})
	.put((req, res) => {
		Article.updateOne(
			{ title: req.params.articleTitle },
			{ title: req.body.title, content: req.body.content },
			(err) => {
				res.send(err || 'Successfully updated article.');
			}
		);
	})
	.patch((req, res) => {
		Article.updateOne({ title: req.params.articleTitle }, { $set: { title: req.body } }, (err) =>
			res.send(err || 'Successfully updatex article.')
		);
	})
	.delete((req, res) => {
		Article.deleteOne({ title: req.params.articleTitle }, (err) => {
			res.send(err || 'Successfully deleted article.');
		});
	});

//////////////////////////////////////////////////////////////////

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server started on port ${process.env.PORT || 3000}`);
});

//////////////////////////////////////////////////////////////////
