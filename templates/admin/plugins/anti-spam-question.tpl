<h1><i class="fa {faIcon}"></i> {name}</h1>

<form role="form" class="{nbbId}-settings">
	<fieldset>
		<div class="row">
			<div class="col-sm-12">
				<div class="form-group">
					<label for="question">anti spam question</label>
					<input placeholder="question" type="text" class="form-control" id="question" name="question" />
				</div>
				<div class="form-group">
					<label for="answer">anti spam answer</label>
					<input placeholder="the correct answer" type="text" class="form-control" id="answer" name="answer"" />
				</div>
			</div>
		</div>
        <hr />
		<button class="btn btn-lg btn-primary" id="save" type="button">Save</button>
	</fieldset>
</form>

<script type="text/javascript">
	require(['settings'], function(Settings) {
		var nbbId = '{nbbId}',
		    klass = nbbId + '-settings',
		    wrapper = $('.' + klass);

		Settings.load(nbbId, wrapper);

		wrapper.find('#save').on('click', function(e) {
			e.preventDefault();
			Settings.save(nbbId, wrapper, function() {
				socket.emit('admin.restart');
			});
		});


	});
</script>
