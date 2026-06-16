from langchain_community.document_loaders import PyPDFLoader


def pdf_reader(file_path):
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    return documents