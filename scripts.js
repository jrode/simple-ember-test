(function() {

	/*****************
	 *  application  *
	 *****************/

	Bx = Ember.Application.create({});

	/************
	 *  router  *
	 ************/

	Bx.Router.reopen({
		location: 'history'
	});

	Bx.Router.map(function() {
		this.route('list', {path: '/simple-ember-test'});
		this.route('new', {path: '/simple-ember-test/new'});
		this.resource('thing', {path: '/simple-ember-test/:id'}, function() {
			this.route('view');
			this.route('edit');
		});
	});

	/************
	 *  routes  *
	 ************/

	Bx.ListRoute = Ember.Route.extend({
		model: function(params) {
			var model = Bx.ListModel.create({});
			model.load(params);
			return model;
		}
	});

	Bx.ThingRoute = Ember.Route.extend({
		model: function(params) {
			var model = Bx.ThingModel.create({});
			model.load(params);
			return model;
		}
	});

	// redirect index '/thing/:id' to '/thing/:id/view'
	Bx.ThingIndexRoute = Ember.Route.extend({
		redirect: function(params) {
			this.transitionTo('thing.view');
		}
	});

	/************
	 *  models  *
	 ************/

	var staticThings = [
		{
			name: 'Blarg',
			details: 'Blargs are really great.'
		},
		{
			name: 'Foo',
			details: 'Foo is the best blarg.'
		},
		{
			name: 'Bar',
			details: 'Often confused with foo!'
		}
	];

	Bx.ListModel = Ember.Object.extend({
		things: Em.A([]),
		name: '',
		details: '',

		load: function(params) {

			// could do ajax call here to load model
			// if so, the following code would go inside the success function

			var things = Em.A([]);

			staticThings.forEach(function(thing, i) {
				thing.id = i;
				things.push(Bx.ThingModel.create(thing));
			});

			this.set('things', things);

		}
	});

	Bx.ThingModel = Ember.Object.extend({
		load: function(params) {

			this.set('id', params.id);

			var thing = staticThings[params.id];

			for (var prop in thing) {
				this.set(prop, thing[prop]);
			}
		},

		save: function() {
			var self = this;
			var id = this.get('id');

			['name', 'details'].forEach(function(prop) {
				staticThings[id][prop] = self.get(prop);
			});
		}
	});

	/*****************
	 *  controllers  *
	 *****************/

	Bx.ApplicationController = Ember.Controller.extend({
		isListPage: function() {
			return this.currentRouteName === 'list';
		}.property('currentRouteName')
	});

	Bx.ListController = Ember.Controller.extend({
		actions: {
			deleteThing: function(id) {
				staticThings.splice(id, 1);
				this.get('model').load();
			}
		}
	})

	Bx.NewController = Ember.Controller.extend({
		actions: {
			saveNew: function() {
				staticThings.push({
					name: this.get('name'),
					details: this.get('details')
				});

				this.transitionTo('list');
			}
		}
	});

	Bx.ThingEditController = Ember.Controller.extend({
		actions: {
			saveChanges: function() {

				// validate first?
				
				this.get('model').save();

				this.transitionTo('thing.view');
			}
		}
	});

	/***********
	 *  views  *
	 ***********/

	// inspired by https://github.com/Octo-Labs/stupid-simple-ember-app/blob/master/js/app.js
	Bx.RandomView = Ember.View.extend({
		layoutName: 'random',
		tagName: 'span',
		classNames: ['random-num'],

		randomText: 'Mouse event binding...',

		click: function(e) {
			this.set('randomText', 'click!');
		},

		mouseMove : function(e) {
			var randomText = 'x:' + e.screenX + ' y:' + e.screenY;
			this.set('randomText', randomText);
		}
	});

	Ember.Handlebars.helper('random', Bx.RandomView);

})();


