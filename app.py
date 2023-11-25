################################################################
# module Constants
from fastapi import FastAPI
from fastapi import Request
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

import json
import requests as http
import xml.etree.ElementTree as Xml

__flibusta_url 	= 'http://flibusta.site'
# module Constants end
################################################################

################################################################
# module Request parser
# The module parse request xml from flibusta to object data
def linksProcess( links ) :
	res = {}
	for link in links :
		if '/opds/author/' in link.attrib['href'] :
			res['author_link'] = link.attrib['href']

		if '/opds/sequencebooks/' in link.attrib['href'] :
			res['sequence_link'] = link.attrib['href']

		if link.attrib['type'] == 'application/fb2+zip' :
			res['download_fb2'] = link.attrib['href']

		if link.attrib['type'] == 'application/epub+zip' :
			res['download_epub'] = link.attrib['href']

		if link.attrib['type'] == 'application/x-mobipocket-ebook' :
			res['download_mobi'] = link.attrib['href']

	return res

def collectionParse( xml_text ) :
	__atom 	= '{http://www.w3.org/2005/Atom}'
	__os	= '{http://a9.com/-/spec/opensearch/1.1/}'

	res     = {}
	books   = []
	root    = Xml.fromstring( xml_text )

	if root.find( __os + 'startIndex' ) != None :
		res['start_index']	= root.find( __os + 'startIndex' ).text
		res['total_result'] 	= root.find( __os + 'totalResults' ).text
		res['items_per_page'] 	= root.find( __os + 'itemsPerPage' ).text

	for entry in root.iter( __atom + 'entry' ) :
		book = {}

		book['links'] 		= linksProcess( entry.findall( __atom + 'link' ) )
		book['title'] 		= entry.find( __atom + 'title' ).text
		book['author'] 		= entry.find( __atom + 'author//' ).text

		books.append( book )

	res['books'] = books

	return res
# module Request parser end.
################################################################

################################################################
# module Get source from flibusta
def searchBooks( req ) :
	response 	= http.get( f'{__flibusta_url}/opds/opensearch?searchTerm={req}' )
	response.encoding = 'utf-8'

	print(f'>>>>>>>>>>>>>>>>>>>>>{__flibusta_url}/opds/opensearch?searchTerm={req}')
	print(f'>>>>>>>>>>>>>>>>>>>>>{response.status_code}')

	if response.status_code == 200 :
		books 	= collectionParse( response.text )
		return books
	else :
		return "{'error': 'No conected to Flibusta OPDS'}"

def getColection( url ) :
	response 	= http.get( f'{__flibusta_url}/opds{url}' )
	response.encoding = 'utf-8'

	if response.status_code == 200 :
		books 	= collectionParse( response.text )
		return books
	else :
		return "{'error': 'No conected to Flibusta OPDS'}"

def getNewBoks() :
	response 	= http.get( f'{__flibusta_url}/opds/new/0/new' )
	response.encoding = 'utf-8'

	if response.status_code == 200 :
		books 	= collectionParse( response.text )
		return books
	else :
		return "{'error': 'No conected to Flibusta OPDS'}"

def downloadBook( id ) :
	file_url = f'{__flibusta_url}/{id}'
	book = http.get( file_url )
	return book.content
# module Get source from flibusta end
################################################################

################################################################
# fast init && routing
app = FastAPI()
app.mount( '/assets/',  StaticFiles( directory="./app/assets" ), name="assets")
templates = Jinja2Templates( directory="./app/templates" )

@app.get( '/', tags=['root'] )
def home( request: Request ) :
	return templates.TemplateResponse(
		'index.html',
		{
			'request': request,
			'app_name': "Flibusta OPDS API"
		}
	)

@app.get( '/new' )
def new() :
	res = getNewBoks()
	return res

@app.get( '/search' )
def search( req ) :
	print( req )
	res = searchBooks( req )
	return res

@app.get( '/author' )
def author( id ) :
	res = getColection( f'{id}/time' )
	return res

@app.get( '/sequence' )
def sequence( id ) :
	res = getColection( id )
	return res

@app.get( '/download' )
def download( id ) :
	res = downloadBook( id )
	return res
# fast init  && routing end
################################################################
