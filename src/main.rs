//#![windows_subsystem = "windows"]

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

    let mut webview = web_view::builder()
        .title("Timeout")
        .content(Content::Html(html))
        .size(800, 600)
        .resizable(false)
        .debug(true)
        .user_data(Props { tasks: vec![] })
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
                    } => props.tasks.push(Task {
                        name,
                        create_time: create_time,
                        duration: duration,
                    }),
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

fn inline_style(s: &str) -> String {
    format!(r#"<style type="text/css">{}</style>"#, s)
}

fn inline_script(s: &str) -> String {
    format!(r#"<script type="text/javascript">{}</script>"#, s)
}
