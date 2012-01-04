/*!
 * Nethnic Tesselate JavaScript Library and jQuery Plugin
 * http://www.nethnic.com/pages/projects/tesselate
 *
 * Copyright 2012, Stefano Butera
 * Released under the LGPL License.
 *
 * Date: Jan 04 2012
 */
 (function($) {

	$.tesselate = {

		applyForwardByRows: function(cells, effect, delay, callback) {

			var i = 0;
			var count = cells.length;

			var job = window.setInterval(function() {

				if (i < count) {
					var nextCell = cells.filter(':eq(' + i + ')');
					//alert('nextCell : ' + nextCell);
					effect(nextCell);
				} else {
					window.clearInterval(job);
					if (callback != null) {
						callback();
					}
				}

				i++;

			}, delay);

		},

		applyForwardByCols: function(cells, effect, delay, callback) {

			var i = 0;
			var count = cells.length;

			var job = window.setInterval(function() {

				var m = i * _cols;
				var j = (m % count) + Math.floor(m / count);

				if (i < count) {
					var nextCell = cells.filter(':eq(' + j + ')');
					effect(nextCell);
				} else {
					window.clearInterval(job);
					if (callback != null) {
						callback();
					}
				}

				i++;

			}, delay);

		},

		applyBackwardsByCols: function(cells, effect, delay, callback) {

			var i = cells.length - 1;

			var job = window.setInterval(function() {

				if (i >= 0) {
					var nextCell = cells.filter(':eq(' + i + ')');
					effect(nextCell);
				} else {
					window.clearInterval(job);
					if (callback != null) {
						callback();
					}
				}

				i--;

			}, delay);

		},

		applyBackwardsByRows: function(cells, effect, delay, callback) {

			var i = cells.length - 1;
			var count = cells.length;

			var job = window.setInterval(function() {

				var m = i * _tesselate.cols;
				var j = (m % count) + Math.floor(m / count);

				if (i >= 0) {
					var nextCell = cells.filter(':eq(' + j + ')');
					effect(nextCell);
				} else {
					window.clearInterval(job);
					if (callback != null) {
						callback();
					}
				}

				i--;

			}, delay);

		},

		applyRandom: function(cells, effect, delay, callback) {

			$.tesselate.shuffle(cells);

			var i = 0;
			var count = cells.length;

			var job = window.setInterval(function() {

				if (i < count) {
					var nextCell = cells.filter(':eq(' + i + ')');
					effect(nextCell);
				} else {
					window.clearInterval(job);
					if (callback != null) {
						callback();
					}
				}

				i++;

			}, delay);

		},

		shuffle: function(group) {

			for(var i = 0; i < group.length; i++) {
				var j = parseInt(Math.random() * i);
				var swapper = group[i];
				group[i] = group[j];
				group[j] = swapper;
			}

			return group;
		}

	};

	$.fn.tesselate = function(options) {
		return this.each(function() {

			var $this = $(this);
			var _gridBox = $('#' + $this.attr('id'));
            var _tesselate = {};

            //alert('rows/cols: ' + options.rows + ' ' + options.cols);
			if (_gridBox.data('tesselate-defined')) {
				_tesselate = _gridBox.data('tesselate-storage');
			} else if ((options.rows != null) && (options.cols != null)) {
				_tesselate = {
					'rows' 			: options.rows,
					'cols'			: options.cols,
					'id'			: $this.attr('id'),
					'url'			: '',
					'totalWidth'	: parseInt($this.width()),
					'totalHeight'	: parseInt($this.height())
				};

				_tesselate.cellWidth	= _tesselate.totalWidth / options.cols;
				_tesselate.cellHeight	= _tesselate.totalHeight / options.rows;
			} else {
				$.error('Grid not defined');
			}

			if ((options.rows != null) && (options.cols != null)) {

				var imageSrc		= $this.attr('src');
				var imageBckGrnd	= $this.css('background-image');

				if (imageSrc != null) {
					_tesselate.url = imageSrc;
				} else if (imageBckGrnd != null) {
					_tesselate.url = imageBckGrnd;
				} else if (_tesselate == null) {
					$.error('No image content available');
				}

				createGrid();

			} else if (options.progression != null) {

				var cells = _gridBox.find('.cell-content');

				if (options.progression == 'forwardByRows') {
					$.tesselate.applyForwardByRows(cells, options.effect, options.delay, options.callback);
				} else if (options.progression == 'forwardByCols') {
					$.tesselate.applyForwardByCols(cells, options.effect, options.delay, options.callback);
				} else if (options.progression == 'backwardsByCols') {
					$.tesselate.applyBackwardsByCols(cells, options.effect, options.delay, options.callback);
				} else if (options.progression == 'backwardsByRows') {
					$.tesselate.applyBackwardsByRows(cells, options.effect, options.delay, options.callback);
				} else if (options.progression == 'random') {
					$.tesselate.applyRandom(cells, options.effect, options.delay, options.callback);
				}

			} else if (options.css != null) {

				var cells = _gridBox.find('.cell-content');

				cells.each(function() {
					$(this).css(options.css);
				});

			}

			$.fn.tesselate.applyOddsFirstForward = function(effect, delay, callback) {
				var cells = _tesselate.gridBox.find('.cell-content');
				var i = 0;
				var count = cells.length;
				var phase = 0;
				var job = window.setInterval(function() {

					if (phase == 0) {
						if (i < count) {
							var nextCell = cells.filter(':eq(' + i + ')');
							effect(nextCell);
						} else {
							phase++;
						}

						i += 2;
					}

					if (phase == 1) {
						i -= 3;
						phase++;
					}

					if (phase == 2) {
						if (i >= 1) {
							var nextCell = cells.filter(':eq(' + i + ')');
							effect(nextCell);
						} else {
							window.clearInterval(job);
							if (callback != null) {
								callback();
							}
						}

						i -= 2;
					}

				}, delay);
			};

			$.fn.tesselate.applyOddsFirstBackwards = function(effect, delay, callback) {
				var cells = _tesselate.gridBox.find('.cell-content');
				var count = cells.length;
				var i = count - 1;
				var phase = 0;
				var job = window.setInterval(function() {

					if (phase == 0) {
						if (i >= 0) {
							var nextCell = cells.filter(':eq(' + i + ')');
							effect(nextCell);
						} else {
							phase++;
						}

						i -= 2;
					}

					if (phase == 1) {
						i += 3;
						phase++;
					}

					if (phase == 2) {
						if (i < count) {
							var nextCell = cells.filter(':eq(' + i + ')');
							effect(nextCell);
						} else {
							window.clearInterval(job);
							if (callback != null) {
								callback();
							}
						}

						i += 2;
					}

				}, delay);
			};

			function createGrid() {
				var elementClassAttr = $this.attr('class');
				elementClassAttr = ((elementClassAttr != undefined) ? (elementClassAttr + ' ') : '');

				var elementStyleAttr = $this.attr('style');
				elementStyleAttr = ((elementStyleAttr != undefined) ? elementStyleAttr : '');

				_gridBox = $('<div id="' + _tesselate.id + '" class="' + elementClassAttr + 'grid-box" style="' + elementStyleAttr + '"></div>');

				_gridBox.width(_tesselate.totalWidth);
				_gridBox.height(_tesselate.totalHeight);

				for (var row = 0; row < _tesselate.rows; row++) {

					var yPosition = row * _tesselate.cellHeight;
					var gridRow = $('<div class="grid-row"></div>');

					gridRow.width(_tesselate.totalWidth);
					gridRow.height(_tesselate.cellHeight);

					for (var col = 0; col < _tesselate.cols; col++) {

						var xPosition = col * _tesselate.cellWidth;
						var gridCell = $('<div class="grid-cell"></div>');
						gridCell.width(_tesselate.cellWidth);
						gridCell.height(_tesselate.cellHeight);

						var cellContent = $('<div class="cell-content"></div>');
						cellContent.width(_tesselate.cellWidth);
						cellContent.height(_tesselate.cellHeight);
						cellContent.css({
							'background-image' 		: 'url("' + _tesselate.url + '")',
							'background-position'	: '-' + xPosition + 'px -' + yPosition + 'px'
						});

						gridCell.append(cellContent);
						gridRow.append(gridCell);
					}

					_gridBox.append(gridRow);
				}

				$this.replaceWith(_gridBox);

				var row = 0;
				var col = 0;
				var ndx = 0;
				_gridBox.find('.cell-content').each(function() {
					$(this).data('row', row);
					$(this).data('col', col);
					$(this).data('index', ndx);
					ndx++;
					col++;
					if (col == _tesselate.cols) {
						row++;
						col = 0;
					}
				});

				_tesselate.gridBox = _gridBox;
			}

			_gridBox.data('tesselate-defined', true);
			_gridBox.data('tesselate-storage', _tesselate);
		});
	}

})(jQuery);