	'use strict';

const app = new Vue({
	el: '.app',
	
	data: 
	{
		book_list_title: undefined,
		books_list: undefined,
		search_string: undefined
	},
	
	template:
	`
		<div class="app container">
			<div class="b-search">
				<div class="search-header">
					<h2>Введите название книги...</h2>
					<div class="b-search-inp">
						<input class="search__inp" placeholder="Введите название книги.." v-model="search_string">
						<button class="search__btn" @click="search">Искать</button>
					</div>
				</div>
				
				<div class="b-books-list">
					<h2>{{book_list_title}}</h2>
					<div v-for="book in books_list">
						<div class="books_list__item">
							<div>
								<h3>{{ book.title }}</h3>
								<a :href="book.links.author_link">{{book.author}}</a>
								<a v-if="book.links.sequence_link" :href="book.links.sequence_link">Все книги серии</a>
							</div>
							<div>
								<h3>Скачать: </h3>
								<a v-if="book.links.download_fb2" :href="book.links.download_fb2">Fb2 </a>
								<a v-if="book.links.download_epub" :href="book.links.download_epub">Fb2 </a>
								<a v-if="book.links.download_mobi" :href="book.links.download_mobi">Fb2 </a>
							</div>
						<div>
					</div>
				</div
			</div>
		</div>
	`,
	
	methods: 
	{
		search()
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
					this.books_list = res.books
				} );
		}
	},
	
	created()
	{
		
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
		
	}
});
