from rest_framework import serializers
class AnalyzeSerializer(serializers.Serializer):
    query = serializers.CharField()
