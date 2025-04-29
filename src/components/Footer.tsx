function Footer() {
    return (
        <footer className="bg-[#2c3e50] text-gray-200 py-3 w-full fixed bottom-0 z-50">
            <div className="w-full mx-auto flex justify-between items-center px-6">
                <div className="text-left">
                    <p className="m-0 text-sm">&copy; {new Date().getFullYear()} Anthony Reynolds. All rights reserved.</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-4">
                        <a 
                            href="https://linktr.ee/sloorjuice" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-200 hover:text-blue-400 transition-colors ml-2"
                        >
                            Follow Me!
                        </a>
                        <p className="m-0 hidden md:block">I Need Coffee. ^</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;