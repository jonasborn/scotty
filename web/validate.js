var _validatorStorage = {}
var _validatorStates = {}

function validation(query, valid, invalid, opt) {


    query.each(function () {
        const input = $(this);
        let describedbyRaw = input.attr("aria-describedby")
        let patternRaw = input.data("pattern")



        if (opt !== undefined && opt !== null && input.attr('id') !== undefined && opt[input.attr('id')] !== undefined) {

            if (describedbyRaw === undefined) {
                describedbyRaw = opt[input.attr('id')]["by"]
            }

            if (patternRaw === undefined) {
                patternRaw = opt[input.attr('id')]["pattern"]
            }
        }



        if (describedbyRaw !== undefined && patternRaw !== undefined) {
            const describedby = $("#" + describedbyRaw)
            _validatorStorage[describedbyRaw] = describedby.text()
            _validatorStates[describedbyRaw] = false

            const onChange = function () {

                let text = input.val()

                if (text === undefined || text == null) {
                    text = ""
                }

                const pattern = new RegExp(patternRaw)

                const found = _validatorStorage[describedbyRaw]


                if (pattern.test(text) && text.replace(pattern, "").length === 0) {
                    if (found !== undefined) {
                        describedby.text(found)
                    } else {
                        describedby.text("")
                    }
                    input.removeClass("bg-danger")
                    input.removeClass("text-white")
                    _validatorStates[describedbyRaw] = true;
                    let call = true
                    Object.entries(_validatorStates).forEach(function (e) {
                        if (e[1] !== true) call = false
                    })
                    if (call) valid()


                } else {
                    if (found !== undefined) {
                        describedby.text(found + " - Nicht valid!")
                    } else {
                        describedby.text("Nicht valid!")
                    }

                    input.addClass("bg-danger")
                    input.addClass("text-white")
                    invalid();

                }

            }


            input.on("keyup", onChange)
            input.on("change", onChange)

            onChange()

        }
    });
}