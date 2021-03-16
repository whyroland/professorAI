import argparse
import io

def transcribe_file(speech_file):
    from google.cloud import speech

    client = speech.SpeechClient.from_service_account_json("key.json")

    with io.open(speech_file, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code="en-US",
        audio_channel_count=2,
    )

    operation = client.long_running_recognize(config=config, audio=audio)

    print("Waiting for operation to complete...")
    response = operation.result(timeout=90)

    for result in response.results:
        print(u"Transcript: {}".format(result.alternatives[0].transcript))
        print("Confidence: {}".format(result.alternatives[0].confidence))

if __name__ == "__main__":
    #transcribe_file("test1.wav")
    val = input("Enter the file: ")
    transcribe_file(val)