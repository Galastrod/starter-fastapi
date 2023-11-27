'use strict';

const app = new Vue({
	el: '.app',

	data:
	{
		book_list_title: undefined,
		books_list: undefined
	},

	template:
	`
		<div class="app container">
			<div class=main>
				<div class=searchr>
					<h2>Что ищем?=)</h2>
					<div class=b-search-inp>
						<input class="search__inp" placeholder="Введите название книги..." v-model="search_string">
						<button class="search__btn" @click="search"><i class="fa-solid fa-magnifying-glass"></i></button>
					</div>
				</div>

				<div class="books-list">
					<h2>{{book_list_title}}</h2>
					<div v-for="book in books_list">
						<div class="books_list__item">
							<div class="col-2">
								<h2>{{ book.title }}</h2>
								<a :href="book.links.author_link" @click="getAuthor">Автор: {{book.author}}</a>
								<a v-if="book.links.sequence_link" :href="book.links.sequence_link" @click="getSequence">Все книги серии: {{book.link.sequence_name}}</a>
							</div>
							<div class="col-2">
								<h2>Скачать: </h2>
								<div class="download-links">
									<button class="btn" v-if="book.links.download_fb2" :data="book.links.download_fb2" @click="downloadBook">Fb2 </button>
									<button class="btn" v-if="book.links.download_epub" :data=".links.download_epub" @click="downloadBook">Epub </button>
									<button class="btn" v-if="book.links.download_mobi" :data="book.links.download_mobi" @click="downloadBook">Mobi </button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="b-more-link">
					<button class="btn btn--more" @click="more">More</button>
				</div>
			</div>
		</div>
	`,

	methods:
	{
		more( page_index )
		{
			fetch( `./more?url=${this.more_link}` )
				.then( res => res.json() )
				.then( res =>
				{
					if( res.error )
					{
						console.error( res );
						return false
					};
					this.book_list_title = `Найдено по запросу: "${req}"`;
					this.books_list = res.books;
					this.more_link = res.more_link;
				} );
		},

		search( page_index )
		{
			let req = this.search_string;

			fetch( `./search?req=${req}` )
				.then( res => res.json() )
				.then( res =>
				{
					if( res.error )
					{
						console.error( res );
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

			fetch( `./author?id=${id}` )
				.then( res => res.json() )
				.then( res =>
				{
					if( res.error )
					{
						console.error( res );
						return false
					};
					this.book_list_title = `Все книги автора: "${aut}"`;
					this.books_list = res.books;
					this.more_link = res.more_link;
				} );
		},

		getSequence(ev)
		{
			ev.preventDefault();

			let id = ev.target.href;

			id = id.slice( id.indexOf( '/sequence' ) )

			fetch( `./sequence?id=${id}` )
				.then( res => res.json() )
				.then( res =>
				{
					if( res.error )
					{
						console.error( res );
						return false
					};
					this.book_list_title = `Все книги серии`;
					this.books_list = res.books;
					this.more__link = res.more_link;
				} );
		},

		downloadBook(ev)
		{
			let id = ev.target.getAttribute( 'data' );

			id = id.slice( id.indexOf( '/b' ) )

			console.log( `./download?id=${id}` )

			fetch(`./download?id=${id}`)
				.then( res => res.arrayBuffer() )
				.then( buffer => 
				{
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

		console.log( id )

		document
			.querySelector( '.main-header-wrap' )
			.style
			.backgroundImage = `url(./assets/img/bg_0${id}.jpg)`

		fetch('./new')
			.then( res => res.json() )
			.then( res =>
			{
				console.table( res )

				if( res.error )
				{
					console.error( res );
					return false
				};
				this.book_list_title = "Новые книжули..."
				this.books_list = res.books;
				this.more__link = res.more_link;
			} );
	}
});
