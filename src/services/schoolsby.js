import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import DOMParser from "react-native-html-parser";

const RCTNetworking = require("react-native/Libraries/Network/RCTNetworking");
import setCookie from "set-cookie-parser";

// https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
const extractHostname = (url) => {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
};

export async function logout() {
  try {
    RCTNetworking.clearCookies(() => {});
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length) await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function login(username, password) {
  if (!username || !password) return false;
  if (!(await logout())) return false;

  let response;

  try {
    response = await fetch("https://schools.by/login");
  } catch (error) {
    console.log(error);
    return false;
  }

  let cookies, cookieHeader;
  if (response.ok) {
    cookieHeader = setCookie.splitCookiesString(
      response.headers.get("set-cookie")
    );
    cookies = setCookie.parse(cookieHeader);
  } else {
    return false;
  }

  try {
    response = await axios.post(
      "https://schools.by/login",
      `csrfmiddlewaretoken=${cookies[0].value}&username=${username}&password=${password}`,
      { headers: { Referer: "https://schools.by/login" } }
    );
  } catch (error) {
    console.log(error);
    return false;
  }

  return response.request.responseURL === "https://schools.by/login"
    ? false
    : await downloadClassId(response.request.responseURL);
}

export async function downloadClassId(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser.DOMParser();

    let doc = parser.parseFromString(html, "text/html");

    // add ?.
    const classId = doc
      .getElementsByClassName("pp_line")[0]
      .getElementsByTagName("a")[0]
      .getAttribute("href");

    if (!classId) return false;

    await AsyncStorage.setItem("sch_url", extractHostname(url));
    await AsyncStorage.setItem("classId", classId);
    return await downloadTimetable();
  } catch (error) {
    console.log(error);
    return false;
  }
}

// null means need relogin
// false means failed
export async function downloadTimetable() {
  try {
    const url = await AsyncStorage.getItem("sch_url");
    const classId = await AsyncStorage.getItem("classId");
    if (!url || !classId) return null;

    const response = await fetch(`https://${url}${classId}/timetable`);
    // redirected === access denied
    if (response.url !== `https://${url}${classId}/timetable`) {
      return null;
    }

    const html = await response.text();
    const parser = new DOMParser.DOMParser();

    let doc = parser.parseFromString(html, "text/html");
    const doc2 = doc.getElementsByClassName("ttb_box", false); // exactMatch === false because one week day also has class today (div.ttb_box.today)
    if (doc2.length !== 6) return false;

    const timetable_complete = [];
    const dayOfWeek_queue = [0, 2, 4, 1, 3, 5]; // schools.by show days like this: Mon -> Thu -> Tue -> Fri -> Wed -> Sat
    while (dayOfWeek_queue.length) {
      const trs = doc2[dayOfWeek_queue.shift()].getElementsByTagName("tr");
      const timetable_day = [];

      // skip first <tr>
      for (let j = 1; j < trs.length; ++j) {
        const tr = trs[j];
        const timetable_lesson = {};

        timetable_lesson.time =
          tr
            .getElementsByClassName("time")[0]
            .textContent.trim()
            .replace(/^\s+|\s+$|\s+(?=\s)/g, "") || "00:00 – 00:00";
        // schools.by has time string like this:
        /*

                                            08:05
                                            –
                                            08:50

				*/

        timetable_lesson.subjs =
          Array.prototype.slice // convert the nodelist to array
            .call(tr.getElementsByTagName("div"))
            .map((div) =>
              Array.prototype.slice
                .call(div.getElementsByTagName("span"))
                .map((span) => span.textContent.trim())
                .join(" ")
            )
            .join("\n") || "Урок";

        timetable_lesson.cabs =
          Array.prototype.slice
            .call(tr.getElementsByClassName("cabinet"))
            .map((cab) => cab.textContent.trim())
            .join("\n") || "—";

        timetable_day.push(timetable_lesson);
      }
      timetable_complete.push(timetable_day);
    }

    /*
		.ttb_box
			.ttb_day - Понедельник
			.ttb_tbl
				<thead>
					<tr>
					</tr>
				</thead>
				<tbody>
					<tr>
						.num - 1.
						.time - 08:05 - 08:50
						.subjs
							<div>
								<span .subj title="Русский язык">Рус. яз.</span>
								<span>(группа Иванова)</span>
							</div>
						<td>
							<span .cabinet>319</span>
							<span .cabinet>218</span>
							<span .cabinet>-</span>
						</td>
					</tr>
				</tbody>
		*/

    // timetable_complete
    /*
			[
				[
					{
						time : "08:05 - 08:50",
						subjs : "Р.яз (группа Иванова)\nР.яз (группа Алексеева)"
						cabs : "319\n218\n-"
					}
				]
			]
		*/

    await AsyncStorage.setItem("timetable", JSON.stringify(timetable_complete));

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
