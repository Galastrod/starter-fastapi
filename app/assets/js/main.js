'use strict';

const app = new Vue({
	el: '.app',

	data:
	{
		book_list_title: undefined,
		books_list: undefined,
		more_link: undefined
	},

	template:
	`
		<div class="app container">
			<div class=main>
				<div class=search>
					<h2>Что ищем?=)</h2>
					<div class=b-search-inp>
						<input class="search__inp" placeholder="Введите название книги..." v-model="search_string" @change="search( 0 )">
						<button class="search__btn" @click="search( 0 )"><i class="fa-solid fa-magnifying-glass"></i></button>
					</div>
				</div>

				<div class="books-list">
					<h2>{{book_list_title}}</h2>
					<div v-for="book in books_list">
						<div class="books_list__item">
							<div class="col-2 book-info">
								<div>
									<h2>{{ book.title }}</h2>
									<a :href="book.links.author_link" @click="getAuthor">Все книги автора: {{book.links.author_name}}</a>
									<a v-if="book.links.sequence_link" :href="book.links.sequence_link" @click="getSequence">Все книги серии: {{book.links.sequence_name}}</a>
								</div>
								<div>
									<h2>Скачать: </h2>
									<div class="download-links">
										<button class="btn" v-if="book.links.download_fb2" :data="book.links.download_fb2" @click="downloadBook">Fb2 </button>
										<button class="btn" v-if="book.links.download_epub" :data=".links.download_epub" @click="downloadBook">Epub </button>
										<button class="btn" v-if="book.links.download_mobi" :data="book.links.download_mobi" @click="downloadBook">Mobi </button>
										<button class="btn" v-if="book.links.download_rtf" :data="book.links.download_rtf" @click="downloadBook">Rtf</button>
										<button class="btn" v-if="book.links.download_txt" :data="book.links.download_txt" @click="downloadBook">Txt </button>
									</div>
								</div>
							</div>
							<div class="col-2">
								<h2>Аннотация: </h2>
								<div class="anottation" v-html="book.anot"></div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="more_link" class="b-more-link">
					<button class="btn btn--more" @click="more">More</button>
				</div>
			</div>
		</div>
	`,

	methods:
	{
		more()
		{
			let more_link = this.more_link;

			if( more_link.indexOf( '/search?' ) != -1 )
			{
				let index = more_link.slice( more_link.lastIndexOf( '=' ) + 1 );
				this.search( index, true )
				return false
			};

			document
				.querySelector( '.loading-bar' )
				.classList
				.toggle( 'loading-bar--active' );

			fetch( `./more?url=${more_link}` )
				.then( res => res.json() )
				.then( res =>
				{
					document
						.querySelector( '.loading-bar' )
						.classList
						.toggle( 'loading-bar--active' );

					if( res.error )
					{
						console.error( res );
						return false
					};

				res.books.forEach( book =>  this.books_list.push( book ) );
				this.more_link = res.more_link;
				} );
		},

		search( page_index, more )
		{
			let req = this.search_string;

			document
				.querySelector( '.loading-bar' )
				.classList
				.toggle( 'loading-bar--active' );

			fetch( `./search?req=${ req }&page_index=${ page_index }` )
				.then( res => res.json() )
				.then( res =>
				{
					document
						.querySelector( '.loading-bar' )
						.classList
						.toggle( 'loading-bar--active' );

					if( res.error )
					{
						console.error( res );
						return false
					};

					if( more ) 
					{
						res.books.forEach( book => this.books_list.push( book ) );
						this.more_link = res.more_link;	
						return false
					};

					this.book_list_title = `Найдено по запросу: "${req}"`;
					this.books_list = res.books;
					this.more_link = res.more_link;
				} );
		},

		getAuthor(ev)
		{
			ev.preventDefault();

			let id = ev.target.href,
				aut = ev.target.innerText;

			id = id.slice( id.indexOf( '/author' ) )

			document
				.querySelector( '.loading-bar' )
				.classList
				.toggle( 'loading-bar--active' );

			fetch( `./author?id=${id}` )
				.then( res => res.json() )
				.then( res =>
				{
					document
						.querySelector( '.loading-bar' )
						.classList
						.toggle( 'loading-bar--active' );

					if( res.error )
					{
						console.error( res );
						return false
					};
					this.book_list_title = aut;
					this.books_list = res.books;
					this.more_link = res.more_link;
				} );
		},

		getSequence(ev)
		{
			ev.preventDefault();

			let id = ev.target.href,
				seq = ev.target.innerText;

			id = id.slice( id.indexOf( '/sequence' ) )

			document
				.querySelector( '.loading-bar' )
				.classList
				.toggle( 'loading-bar--active' );

			fetch( `./sequence?id=${id}` )
				.then( res => res.json() )
				.then( res =>
				{
					document
						.querySelector( '.loading-bar' )
						.classList
						.toggle( 'loading-bar--active' );

					if( res.error )
					{
						console.error( res );
						return false
					};
					this.book_list_title = seq;
					this.books_list = res.books;
					this.more_link = res.more_link;
				} );
		},

		downloadBook(ev)
		{
			let id = ev.target.getAttribute( 'data' );

			id = id.slice( id.indexOf( '/b' ) )

			console.log( `./download?id=${id}` )

			document
				.querySelector( '.loading-bar' )
				.classList
				.toggle( 'loading-bar--active' );


			fetch(`./download?id=${id}`)
				.then( res => res.arrayBuffer() )
				.then( buffer => 
				{
					document
						.querySelector( '.loading-bar' )
						.classList
						.toggle( 'loading-bar--active' );

					let 
						file = new Blob( [buffer], {type: 'application/zip'}),
						url = URL.createObjectURL(file);


					console.log( file )
					window.open( url )
				})
		}
	},

	created()
	{
		let id = '' + Math.random(); 
			id = parseInt( id.slice( 2, 3 ) );

		document
			.querySelector( '.main-header-wrap' )
			.style
			.backgroundImage = `url(./assets/img/bg_0${id}.jpg)`

		document
			.querySelector( '.loading-bar' )
			.classList
			.toggle( 'loading-bar--active' );


		fetch('./new')
			.then( res => res.json() )
			.then( res =>
			{
				document
					.querySelector( '.loading-bar' )
					.classList
					.toggle( 'loading-bar--active' );

				if( res.error )
				{
					console.error( res );
					return false
				};
				this.book_list_title = "Новые книжули..."
				this.books_list = res.books;
				this.more_link = res.more_link;
			} );
	}
});
