<!-- https://jay23606.github.io/chat-gpt-voice/html/toggleAsDiv.js -->
function toggleAsDiv(container, elementType) {
    $(container).find(elementType).each(function() {
        var originalElement = $(this);
        var value = originalElement.val() || originalElement.text();
        var div = $('<div>').text(value).attr('data-was-element', elementType);
        $.each(originalElement.get(0).attributes, function(i, attrib) {
            if (attrib.name !== 'data-was-element') {
                div.attr(attrib.name, attrib.value);
            }
        });
        originalElement.replaceWith(div);
    });

    $(container).find('div[data-was-element="' + elementType + '"]').each(function() {
        var div = $(this);
        var value = div.text();
        var newElement = $('<' + elementType + '>').val(value);
        $.each(div.get(0).attributes, function(i, attrib) {
            if (attrib.name !== 'data-was-element') {
                newElement.attr(attrib.name, attrib.value);
            }
        });
        div.replaceWith(newElement);
    });
}