'use strict';

const pugination = 
{
	props: [ 'start', 'total', 'per_page' ],

	template: 
	`
		<div v-if="start" class=pugination>
			<button v-if="prev_page" class="btn" @click="goTo( '--prev' )"><i class="fa fa-angle-double-left"></i></button>
			<p class="pugination__curent-page">{{ curent_page }}</p>
			<button v-if="next_page" class="btn" @click="goTo( '--next' )"><i class="fa fa-angle-double-right"></i></button>
		</div>
	`,

	methods: 
	{
		goTo( key )
		{
			let new_page_index = 
				key == '--next' ? this.next_page :
				key == '--prev' ? this.prev_page :
				key;

			this.$root.search( new_page_index );
		}
	},

	computed:
	{
		curent_page()
		{
			return Math.floor( this.start / this.per_page + 1 )
		},

		next_page()
		{
			let new_start = this.start + this.per_page;


			if( new_start > this.total )
				return false;

			return Math.floor( new_start / this.per_page + 1 )
		},

		prev_page()
		{
			let new_start = this.start - this.per_page;

			console.log( `>>>>>>>> ${new_start}` )

			if( new_start < 0 )
				return false;

			return Math.floor( new_start / this.per_page + 1 )
		}
	}
};

const app = new Vue({
	el: '.app',

	data:
	{
		book_list_title: undefined,
		books_list: undefined,
		search_string: undefined,
		total: undefined,
		start: undefined,
		per_page: undefined
	},

	template:
	`
		<div class="app container">
			<div class=main>
				<div class=searchr>
					<h2>Введите название книги...</h2>
					<div class=b-search-inp>
						<input class="search__inp" placeholder="Введите название книги.." v-model="search_string">
						<button class="search__btn" @click="search"><i class="fa-solid fa-magnifying-glass"></i></button>
					</div>
				</div>

				<div class="books-list">
					<h2>{{book_list_title}}</h2>
					<div v-for="book in books_list">
						<div class="books_list__item">
							<div class="col-2">
								<h2>{{ book.title }}</h2>
								<a :href="book.links.author_link" @click="getAuthor">{{book.author}}</a>
								<a v-if="book.links.sequence_link" :href="book.links.sequence_link" @click="getSequence">Все книги серии</a>
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

				<pugination :total="total" :start="start" :per_page="per_page"></pugination>
			</div>
		</div>
	`,

	methods:
	{
		search( page_index )
		{
			let req = this.search_string;

			fetch( `./search?req=${req}&page_index=${ typeof page_index == 'number' ? page_index : 0 }` )
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
					this.start = res.start_index;
					this.total = res.total_result;
					this.per_page = res.items_per_page;
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
					this.books_list = res.books
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
					this.books_list = res.books
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
				this.books_list = res.books
			} );
	},

	components: 
	{
		'pugination': pugination
	}
});
