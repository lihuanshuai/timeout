//#![windows_subsystem = "windows"]

use std::env;
use std::fs;
use std::io;
use std::path::PathBuf;

#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate web_view;

use web_view::*;

fn main() {
    let html = format!(
        r#"
		<!doctype html>
		<html>
			<head>
				{styles}
			</head>
			<body>
				<!--[if lt IE 9]>
				<div class="ie-upgrade-container">
					<p class="ie-upgrade-message">
                    Please, upgrade Internet Explorer to continue using this software.
                    </p>
					<a class="ie-upgrade-link" target="_blank"
                        href="https://www.microsoft.com/en-us/download/internet-explorer.aspx">
                        Upgrade
                    </a>
				</div>
				<![endif]-->
				<!--[if gte IE 9 | !IE ]> <!-->
				<div id="app"></div>
				{scripts}
				<![endif]-->
			</body>
		</html>
		"#,
        styles = inline_style(include_str!("../assets/dist/index.css")),
        scripts = inline_script(include_str!("../assets/dist/index.js"))
    );
    // println!("html {}", html);

    let dump_path = match get_props_dump_path() {
        Ok(exe_path) => exe_path,
        Err(e) => panic!("failed to get props dump path: {}", e),
    };
    println!("props dump path: {}", dump_path.to_str().unwrap());

    let handler = DumpHandler::new(dump_path);
    let props = match handler.read() {
        Ok(props) => props,
        Err(_) => Props { tasks: vec![] },
    };

    let mut webview = web_view::builder()
        .title("Timeout")
        .content(Content::Html(html))
        .size(800, 600)
        .resizable(true)
        .debug(true)
        .user_data(props)
        .invoke_handler(|webview, arg| {
            use Cmd::*;

            let tasks_len = {
                let props = webview.user_data_mut();

                match serde_json::from_str(arg).unwrap() {
                    Init => (),
                    Log { text } => println!("{}", text),
                    AddTask {
                        name,
                        create_time,
                        duration,
                    } => {
                        props.tasks.retain(|t| t.name != name);
                        props.tasks.push(Task {
                            name,
                            create_time: create_time,
                            duration: duration,
                        })
                    }
                    DelTask { name } => props.tasks.retain(|t| t.name != name),
                }

                props.tasks.len()
            };

            webview.set_title(&format!("Timeout ({} Tasks)", tasks_len))?;
            render(webview)
        })
        .build()
        .unwrap();

    webview.set_color((156, 39, 176));

    let res = webview.run().unwrap();
    println!("final state: {:?}", res);
    handler.write(&res).unwrap();
}

fn render(webview: &mut WebView<Props>) -> WVResult {
    let render_tasks = {
        let props = webview.user_data();
        // println!("{:#?}", tasks);
        format!(
            "window.renderApp({})",
            serde_json::to_string(props).unwrap()
        )
    };
    webview.eval(&render_tasks)
}

#[derive(Debug, Serialize, Deserialize)]
struct Task {
    name: String,
    create_time: f64,
    duration: f64,
}

#[derive(Debug, Serialize, Deserialize)]
struct Props {
    tasks: Vec<Task>,
}

#[derive(Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
pub enum Cmd {
    Init,
    Log {
        text: String,
    },
    AddTask {
        name: String,
        create_time: f64,
        duration: f64,
    },
    DelTask {
        name: String,
    },
}

struct DumpHandler {
    path: PathBuf,
}

impl DumpHandler {
    fn new(path: PathBuf) -> DumpHandler {
        DumpHandler { path: path }
    }

    fn read(&self) -> Result<Props, Box<dyn std::error::Error>> {
        if !self.path.is_file() {
            Ok(Props { tasks: vec![] })
        } else {
            let content = fs::read_to_string(&self.path)?;
            println!("loaded content from {}", content);
            match serde_json::from_str(&content) {
                Ok(props) => Ok(props),
                Err(_) => Ok(Props { tasks: vec![] }), // TODO: pass error
            }
        }
    }

    fn write(&self, props: &Props) -> Result<(), Box<dyn std::error::Error>> {
        let content = serde_json::to_string(&props)?;
        fs::write(&self.path, content)?;
        Ok(())
    }
}

fn get_props_dump_path() -> io::Result<PathBuf> {
    let mut path = env::current_exe()?;
    path.pop();
    path.push("props_dump.json");
    Ok(path)
}

fn inline_style(s: &str) -> String {
    format!(r#"<style type="text/css">{}</style>"#, s)
}

fn inline_script(s: &str) -> String {
    format!(r#"<script type="text/javascript">{}</script>"#, s)
}
